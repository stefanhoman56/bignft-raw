import 'bootstrap/dist/css/bootstrap.min.css';
import { ContractFactory, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Web3Modal from 'web3modal';
import ContractABI, { BEP20ABI, BigNFTABI } from './Constants/ABI';
import { BSCMainRPCUrl, BSCTestRPCUrl, BUSD_ADDRESS, DAI_ADDRESS, IBAT_ADDRESS, MainTokenAddress, providerOptions, TEST_MODE, USDC_ADDRESS, USDT_ADDRESS } from './Constants/Constants';
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
  const defaultProvider = new ethers.providers.JsonRpcProvider(TEST_MODE ? BSCTestRPCUrl : BSCMainRPCUrl);
  const readContract = new ethers.Contract(MainTokenAddress, BigNFTABI, defaultProvider);

  const [provider, setProvider] = useState(defaultProvider);
  const [account, setAccount] = useState();
  const [contracts, setContracts] = useState({
    main: readContract
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
      const accounts = await provider.listAccounts();
      if (accounts)
        setAccount(accounts[0]);

      setContracts({
        main: new ethers.Contract(MainTokenAddress, BigNFTABI, provider.getSigner()),
        USDT: new ethers.Contract(USDT_ADDRESS, BEP20ABI, provider.getSigner()),
        USDC: new ethers.Contract(USDC_ADDRESS, BEP20ABI, provider.getSigner()),
        BUSD: new ethers.Contract(BUSD_ADDRESS, BEP20ABI, provider.getSigner()),
        DAI: new ethers.Contract(DAI_ADDRESS, BEP20ABI, provider.getSigner()),
        IBAT: new ethers.Contract(IBAT_ADDRESS, BEP20ABI, provider.getSigner()),
      });
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
