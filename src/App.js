import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Web3Modal from 'web3modal';
import ContractABI from './Constants/ABI';
import { BSCTestRPCUrl, ContractAddress, providerOptions, TestnetChainID } from './Constants/Constants';
import Home from './Pages/Home';
import Sale from './Pages/Sale';
import UserContext from './UserContext';

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
});

// const defaultProvider = new ethers.providers.InfuraProvider(97, process.env.INFURA_ID);
// const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
// const readContract = new web3.eth.Contract(ContractABI, ContractAddress);

function App() {
  const defaultProvider = new ethers.providers.JsonRpcProvider(BSCTestRPCUrl);
  const readContract = new ethers.Contract(ContractAddress, ContractABI, defaultProvider);

  const [provider, setProvider] = useState(defaultProvider);
  const [account, setAccount] = useState();
  const [contract, setContract] = useState(readContract);
  const [connectError, setConnectError] = useState("");

  const connectWallet = async () => {
    if (account) {
      return
    }

    try {
      let provider;
      try {
        provider = await web3Modal.connect();
      } catch (error) {
        return false;
      }
      provider = new ethers.providers.Web3Provider(provider);
      const accounts = await provider.listAccounts();
      if (accounts)
        setAccount(accounts[0]);

      const contract = new ethers.Contract(ContractAddress, ContractABI, provider.getSigner());
      setContract(contract);
      setProvider(provider);
      return true;
    } catch (error) {
      if (error !== 'Modal closed by user') {
        setConnectError(error)
      }
      return false;
    }
  };

  const disconnectWallet = () => {
    web3Modal.clearCachedProvider();
    setAccount();
    setConnectError("");
  };

  return (
    <UserContext.Provider value={{ provider, account, contract, connectError, connectWallet, disconnectWallet }}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/presale" element={<Sale />} />
        </Routes>
      </Router>

    </UserContext.Provider>
  );
}

export default App;
