import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Web3Modal from 'web3modal';
import { BEP20ABI, BigNFTABI } from './Constants/ABI';
import { ContractAddr, providerOptions, RPCUrl } from './Constants/Constants';
import Home from './Pages/Home';
import Sale from './Pages/Sale';
import UserContext from './UserContext';

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
});

// const defaultProvider = new ethers.providers.InfuraProvider(97, INFURA_ID);
// const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
// const readContract = new web3.eth.Contract(ContractABI, ContractAddress);

function App() {
  const defaultProvider = new ethers.providers.JsonRpcProvider(RPCUrl);
  const readContract = new ethers.Contract(ContractAddr.Main, BigNFTABI, defaultProvider);

  const [provider, setProvider] = useState(defaultProvider);
  const [account, setAccount] = useState();
  const [contracts, setContracts] = useState({
    Main: readContract
  });
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

      const contracts = {}
      for (const [token, address] of Object.entries(ContractAddr)) {
        contracts[token] = new ethers.Contract(address, token == "Main" ? BigNFTABI : BEP20ABI, provider.getSigner())
      }
      setContracts(contracts);
      setProvider(provider);

      const accounts = await provider.listAccounts();
      if (accounts)
        setAccount(accounts[0]);
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
    <UserContext.Provider value={{ provider, account, contracts, connectError, connectWallet, disconnectWallet }}>
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
