import React, { useEffect, useCallback, useState } from "react";
import "./styles/App.scss";
import { useMoralis, useWeb3ExecuteFunction, useChain } from "react-moralis";
import { ABI_BIGNFT, NFT_CONTRACT_ADDRESS_PHASE, TOTAL_AMOUNT_TO_RAISE, NFT_TOKEN_DECIMALS, ABI_BATSPresale_ETH, ETH_NFT_CONTRACT_ADDRESS, BSCMainRPCUrl } from "./CONTRACT_DETAILS";

import Header from "./components/Header";
import Main from "./components/Main";
import bg from "./assets/bg.png"
import { Flex, useMediaQuery } from "@chakra-ui/react";
import { BSC_COINS_SUPPORTED, ETH_COINS_SUPPORTED } from "./COINS_SUPPORTED";
import { ETHMainRPCUrl } from "./CONTRACT_DETAILS";
import { ethers } from 'ethers';

// FIREBASE - START
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database"; //to update value of tokensSold
import { useObject } from "react-firebase-hooks/database";

// import { getAnalytics } from "firebase/analytics";
// FIREBASE - END

// ---------- APP -------------
function App() {
  const [reRender, setReRender] = useState(false);
  // const [supply, setSupply] = React.useState();

  const {
    authenticate,
    isWeb3Enabled,
    isAuthenticated,
    user,
    enableWeb3,
    isWeb3EnableLoading,
    Moralis,
  } = useMoralis();

  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  useEffect(() => {
    if (!isWeb3Enabled && isAuthenticated) {
      if (isWeb3EnableLoading)
        Moralis.enableWeb3()
          .then(() => {
            console.log(`isWeb3Enabled✅ - ${Moralis.isWeb3Enabled()}`);
            console.log("web3 activated");
          })
          .catch(() => {
            console.log("❌web3 activation failed");
            console.log(`isWeb3Enabled❌- ${Moralis.isWeb3Enabled()}`);
          });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3Enabled, isAuthenticated, enableWeb3]);


  /**
   * Moralis - START
   */
  const { fetch } = useWeb3ExecuteFunction();
  /**
   * Moralis - END
   */

  /**
   * FIREBASE- START
   * 
   */
  const firebaseConfig = {
    apiKey: "AIzaSyARJJ1R6Jfb0ffNEJHIevrwlScwW40qqsc",
    authDomain: "battleinfinityio.firebaseapp.com",
    databaseURL: "https://battleinfinityio-default-rtdb.firebaseio.com",
    projectId: "battleinfinityio",
    storageBucket: "battleinfinityio.appspot.com",
    messagingSenderId: "694775551331",
    appId: "1:694775551331:web:a63eda8773e72f371daf56",
    measurementId: "G-7Q5BZRQWKL"
  };
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getDatabase();
  const [currentPhaseDB, currentPhaseDB_loading] = useObject(
    ref(db, "currentPhase")
  );
  const [currentPhase, setCurrentPhase] = useState("1")
  const [currentPhaseLoading, setCurrentPhaseLoading] = useState(true);
  useEffect(() => {
    if (currentPhaseDB_loading || !currentPhaseDB) return;
    setCurrentPhase(currentPhaseDB.val());
    console.log(`currentPhaseDB.val() - ${currentPhaseDB.val()}`);
  }, [currentPhaseDB, currentPhaseDB_loading])

  useEffect(() => {
    setCurrentPhaseLoading(currentPhaseDB_loading);
  }, [currentPhaseDB_loading]);
  // const analytics = getAnalytics(firebaseApp);



  /**
   * checking allowance - START
   */
  const { chainId } = useChain(); // Fetch current chainId
  const hasAllowance = useCallback(async (userAddress, spenderContractAddress, tokenAddressToCheck) => {
    const COINS_SUPPORTED = chainId === "0x1" ? ETH_COINS_SUPPORTED : BSC_COINS_SUPPORTED;
    let ABI_allowance = COINS_SUPPORTED.filter(e => e.bscContractAddress.toUpperCase() === tokenAddressToCheck.toUpperCase())[0].ABI_allowance;
    tokenAddressToCheck = tokenAddressToCheck && tokenAddressToCheck.length > 0 ? tokenAddressToCheck : "0x19cd9b8e42d4ef62c3ea124110d5cfd283ceac43";

    // console.log(chainId, "TOK", tokenAddressToCheck, ABI_allowance);

    let optionsAllowance = {
      abi: ABI_allowance,
      contractAddress: tokenAddressToCheck,
      functionName: "allowance",
      params: {
        owner: userAddress,
        spender: spenderContractAddress,
      },
    };
    // console.log(`optionsAllowance - ${tokenAddressToCheck}`);
    // console.log(optionsAllowance);
    let hasAl = false;
    // console.log('✅allowance', optionsAllowance);
    await fetch({
      params: optionsAllowance,
      onSuccess: (data) => {
        if (data._hex !== "0x00") {
          console.log(`✅allowance - ${tokenAddressToCheck}`);
          hasAl = true;
        } else {
          console.log(`❌allowance - ${tokenAddressToCheck}`);
        }
      },
      onError: (err) => {
        console.error(err);
        console.error(`dev-❌failed to run allowance function`);
      },
    });
    // console.log('HHHHH', hasAl);
    return hasAl;
  }, [fetch, chainId])


  useEffect(() => {
    if (!isWeb3Enabled || !isAuthenticated) return;
    const supportCoins = chainId === "0x1" ? ETH_COINS_SUPPORTED : BSC_COINS_SUPPORTED;
    let panCONTRACT_ADDRESS = "0xe4d629d2DF66714eD0dd4EF8e27B3c69746d72e3";
    panCONTRACT_ADDRESS = chainId === "0x1" ? ETH_NFT_CONTRACT_ADDRESS : NFT_CONTRACT_ADDRESS_PHASE;
    // console.log('chainId', chainId, supportCoins);
    supportCoins.forEach((token) => {
      if (token.symbol.toUpperCase() !== "BNB" && token.symbol.toUpperCase() !== "ETH") {
        // @reminder - not sure if we need to check allowance in this one - if so - the spender will be BATTLESQUAD contract addres right? asked Jagjeet this - waiting for response to do further development
        // console.log(`reRender(${reRender}) Value changed - so refereshing`);
        // if (chainId === '0x1')
        //   console.log('^^^');
        hasAllowance(user.get("ethAddress"), panCONTRACT_ADDRESS, token.bscContractAddress).then((hasAl) => {
          // console.log(`${token.symbol} - swap allowance - ${hasAl}`);
          // console.log(`${chainId} - swap allowance - ${hasAl}`);
          if (hasAl) window.localStorage.setItem(`BIGNFT_${token.symbol.toUpperCase()}allowance`, "true");
          else window.localStorage.setItem(`BIGNFT_${token.symbol.toUpperCase()}allowance`, "false");
        });
      }
    })
    window.localStorage.setItem(`BIGNFT_BNBallowance`, "true");
    window.localStorage.setItem(`BIGNFT_ETHallowance`, "true");
    // tokenAllowance removed when logging out - window.localStorage.removeItem
  }, [isWeb3Enabled, isAuthenticated, user, hasAllowance, reRender, currentPhase, chainId]);
  /**
   * checking allowance - END
   */

  /**
   * START
   * Checking how many tokens are left for sale
   */

  const [totalAmountRaised, setTotalAmountRaised] = useState(0);
  const updateInDB = useCallback((field, value) => {
    if (!field || !value || value === 0) return;
    console.log(`🔥FirebaseDB - ${field}  - ${value}`);

    if (field === "tokensSold") {
      update(ref(db), { "tokensSold": value }).then(() => {
        console.log(`🔥🟢updateInDB - ${field} - ${value}`);
      }).catch(console.log(`🔥🔴dev-failed-updateInDB(field-${field}, value - ${value})`));
    } else if (field === "presaleProgressBar") {
      update(ref(db), { "presaleProgressBar": value }).then(() => {
        console.log(`🔥🟢updateInDB - ${field} - ${value}`);
      }).catch(console.log(`🔥🔴dev-failed-updateInDB(field-${field}, value - ${value})`))
    }
    else if (field === "currentPhase") {
      update(ref(db), { "currentPhase": value }).then(() => {
        console.log(`🔥🟢updateInDB - ${field} - ${value}`);
      }).catch(console.log(`🔥🔴dev-failed-updateInDB(field-${field}, value - ${value})`))
    }
    else if (field === "/raisedInPhase/1") {
      update(ref(db), { "/raisedInPhase/1": value }).then(() => {
        console.log(`🔥🟢updateInDB - ${field} - ${value}`);
      }).catch(console.log(`🔥🔴dev-failed-updateInDB(field-${field}, value - ${value})`))
    }
    else if (field === "/raisedInPhase/2") {
      update(ref(db), { "/raisedInPhase/2": value }).then(() => {
        console.log(`🔥🟢updateInDB - ${field} - ${value}`);
      }).catch(console.log(`🔥🔴dev-failed-updateInDB(field-${field}, value - ${value})`))
    }
    else if (field === "/raisedInPhase/3") {
      update(ref(db), { "/raisedInPhase/3": value }).then(() => {
        console.log(`🔥🟢updateInDB - ${field} - ${value}`);
      }).catch(console.log(`🔥🔴dev-failed-updateInDB(field-${field}, value - ${value})`))
    }
    ;

  }, [db]);

  const getAmountRaised = useCallback(async (smartContract, amountToRaise, phaseNum) => {
    // console.log(`💩💩💩 ${smartContract} 💩💩💩`);
    const totalToRaiseInCurrentPhase = amountToRaise;

    const defaultProvider = new ethers.providers.JsonRpcProvider(smartContract === ETH_NFT_CONTRACT_ADDRESS ? ETHMainRPCUrl : BSCMainRPCUrl);
    // console.log(chainId);
    const readContract = new ethers.Contract(smartContract, smartContract === ETH_NFT_CONTRACT_ADDRESS ? ABI_BATSPresale_ETH : ABI_BIGNFT, defaultProvider);

    // console.log('CHCH', phaseNum, chainId);
    let amountRaised = 0;
    try {
      const res = await readContract.inSaleUSDvalue();
      // console.log("========================", phaseNum, amountToRaise, res)

      const amountLeftToRaiseInCurrentPhase = (res["_hex"]);
      amountRaised = totalToRaiseInCurrentPhase - (amountLeftToRaiseInCurrentPhase / Math.pow(10, NFT_TOKEN_DECIMALS)).toFixed(2);
    } catch (error) {
      console.log('bError', phaseNum, readContract);
      console.error(error);
    }
    // const res = 1;

    // const fnName = "inSaleUSDvalue";
    // let options = {
    //   abi: chainId === "0x89" ? ABI_BATSPresale_MATIC : ABI_BIGNFT,
    //   contractAddress: smartContract,
    //   functionName: fnName,
    // };
    // console.log('*****', smartContract, amountToRaise, phaseNum);
    // let amountRaised = 0;
    // await fetch({
    //   params: options,
    //   onSuccess: (data) => {
    //     const amountLeftToRaiseInCurrentPhase = Number(data._hex);
    //     console.log(`👹 amountLeftToRaiseInCurrentPhase - ${phaseNum} - ${(amountLeftToRaiseInCurrentPhase / Math.pow(10, 18)).toFixed(2)} 👹`);

    //     amountRaised = totalToRaiseInCurrentPhase - (amountLeftToRaiseInCurrentPhase / Math.pow(10, NFT_TOKEN_DECIMALS)).toFixed(2);

    //     // console.log(`🪙🪙🪙 amountRaised - ${amountRaised} - ${phaseNum} 🪙🪙`);
    //     console.log(amountRaised);
    //   },
    //   onError: (err) => {
    //     console.error(err);
    //     console.error(`dev-❌failed to getTotalBIGNFTSold`);
    //   },
    // });
    return amountRaised;
  }, [chainId]);

  const getTotalAmountRaised = useCallback(async () => {
    let totalAmountRaised = 0;
    // console.log('UUUU', chainId, currentPhase, totalAmountRaised);
    // for (let i = 1; i <= 3; i++) {
    //   if (i === 1) {
    //     let phase1Raised = await getAmountRaised(NFT_CONTRACT_ADDRESS_PHASE, TOTAL_AMOUNT_TO_RAISE.phase1, "phase1");
    //     totalAmountRaised += phase1Raised;
    //     console.log('UUUU', chainId, currentPhase, totalAmountRaised);
    //     updateInDB("/raisedInPhase/1", `${phase1Raised}`);
    //     // updateInDB("phase1Raised", `${phase1Raised}`);
    //     if (phase1Raised !== 0) {
    //       updateInDB("currentPhase", "1");
    //     }
    //     console.log(`phase1 - ${phase1Raised} !== ${phase1Raised !== 0}`);
    //   }
    //   else if (i === 2) {
    //     let phase2Raised = await getAmountRaised(NFT_CONTRACT_ADDRESS_PHASE, TOTAL_AMOUNT_TO_RAISE.phase2, "phase2");
    //     console.log('UUUU', chainId, currentPhase, totalAmountRaised);
    //     totalAmountRaised += phase2Raised;
    //     updateInDB("/raisedInPhase/2", `${phase2Raised}`);
    //     if (phase2Raised !== 0) {
    //       updateInDB("currentPhase", "2")
    //     }
    //     console.log(`phase2 - ${phase2Raised} !== ${phase2Raised !== 0}`);
    //   }
    //   else if (i === 3) {
    //     let phase3Raised = await getAmountRaised(NFT_CONTRACT_ADDRESS_PHASE, TOTAL_AMOUNT_TO_RAISE.phase3, "phase3");
    //     console.log('UUUU', chainId, currentPhase, totalAmountRaised);
    //     totalAmountRaised += phase3Raised;
    //     updateInDB("/raisedInPhase/3", `${phase3Raised}`);
    //     if (phase3Raised !== 0) {
    //       updateInDB("currentPhase", "3");
    //     }
    //     console.log(`phase3 -  ${phase3Raised} !== ${phase3Raised !== 0}`);
    //   }
    // }
    // console.log('=-', currentPhase);
    const phaseRaised = await getAmountRaised(NFT_CONTRACT_ADDRESS_PHASE, TOTAL_AMOUNT_TO_RAISE[Object.keys(TOTAL_AMOUNT_TO_RAISE).at(currentPhase)], currentPhase);
    // console.log("*(", currentPhase);

    totalAmountRaised += phaseRaised;
    updateInDB(`/raisedInPhase/${currentPhase}`, `${phaseRaised}`);
    console.log(`/raisedInPhase/${currentPhase}`, `${phaseRaised}`);
    // totalAmountRaised += await getAmountRaised(ETH_NFT_CONTRACT_ADDRESS, TOTAL_AMOUNT_TO_RAISE.phase1, "phase1");
    // console.log(`🔵 totalAmountRaised - ${totalAmountRaised} 🔵`);
    // console.log(`reRender[${reRender}] changed, so updating values - (getTotalAmountRaised).`);

    setTotalAmountRaised(totalAmountRaised);
    updateInDB("tokensSold", `${totalAmountRaised}`)

  }, [updateInDB, reRender, currentPhase, chainId]);

  useEffect(() => {
    if (!isWeb3Enabled) return;
    getTotalAmountRaised();
  }, [isWeb3Enabled, getTotalAmountRaised])
  /**
   * END
   * Checking how many tokens are left for sale
   */

  /**
   * START
   * Update /presaleProgressBar in firebaseDB
   */
  // const defaultProvider = new ethers.providers.JsonRpcProvider(ETHMainRPCUrl);
  // const readContract = new ethers.Contract(ETH_NFT_CONTRACT_ADDRESS, ABI_BATSPresale_ETH, defaultProvider);
  // useEffect(async () => {
  //   const res = await readContract.totalTokensForPresale();
  //   setSupply(Number(res["_hex"]) + TOTAL_AMOUNT_TO_RAISE.total);
  // }, [])
  const updateProgressBar = useCallback(() => {
    // console.log(`reRender[${reRender}] changed, so updating values - (updateProgressBar).`);

    // console.log('cccaled', totalAmountRaised);
    let percentage = ((totalAmountRaised / TOTAL_AMOUNT_TO_RAISE.total) * 100).toFixed(1);

    updateInDB("presaleProgressBar", percentage)
  }, [updateInDB, totalAmountRaised, reRender]);

  useEffect(() => {
    if (!isWeb3Enabled) return;
    updateProgressBar()
  }, [isWeb3Enabled, updateProgressBar])
  /**
   * END
   * Update /presaleProgressBar in firebaseDB
   */


  /**
   * START
   * Update /presaleProgressBar in firebaseDB
   */

  const login = async (provider) => {
    if (!isAuthenticated) {
      let signingMessage = `Battle Squad Authentication - Battle Infinity`;
      if (!provider) {
        await authenticate({ signingMessage: signingMessage })
          .then(async (user) => {
            console.log("logged in user:", user);
            user && console.log(user.get("ethAddress"));
            user &&
              window.localStorage.setItem(
                "BIGNFT_userAddress",
                user.get("ethAddress")
              );
          })

          .catch(function (error) {
            console.log(error);
            console.error(`dev-failed to authenticate`);
          });
      } else if (provider === "walletconnect") {
        console.log(`WC - ${provider === "walletconnect"}`);
        console.log(`Logging with ${provider} - app`);
        await authenticate({
          provider: "walletconnect",
          chainId: 56,
          signingMessage: signingMessage,
        }).then((user) => {
          console.log(`isAuthenticated - ${isAuthenticated}.`);
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
          console.log(`isAuthenticated - ${isAuthenticated}.`);
          user && console.log(user.get("ethAddress"));
          user &&
            window.localStorage.setItem(
              "BIGNFT_userAddress",
              user.get("ethAddress")
            );
        });
        try {
          console.log("logged in user:", user);
          user && console.log(user.get("ethAddress"));
        } catch (error) {
          console.log(error);
          console.error(`dev-failed to authenticate with walletconnect`);
        }
      }
    }
  };


  return (
    <Flex className="app" direction="column" backgroundImage={bg} backgroundPosition={isLargerThan500 ? "center" : "right"} backgroundSize={"cover"} >

      <Header login={login}></Header>
      <Main
        login={login}
        reRender={reRender}
        setReRender={setReRender}
        firebaseApp={firebaseApp}
        currentPhase={currentPhase}
        currentPhase_loading={currentPhaseLoading}
      ></Main>
    </Flex>
  );
}

export default App;
