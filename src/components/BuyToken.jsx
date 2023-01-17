import { Flex, Heading, Text } from "@chakra-ui/react";
import BuyButton from "./BuyButton";
import CoinSelector from "./CoinSelector";
import InputAmount from "./InputAmount";
import {
  NFT_CONTRACT_ADDRESS_PHASE,
  ETH_NFT_CONTRACT_ADDRESS,
  ABI_BIGNFT,
  ABI_BATSPresale_ETH,
  NFT_TOKEN_SYMBOL,
  IBAT_HARDCAP_IN_USD,
  BIGNFT_PRICE_USD_PHASE_ONE,
  BIGNFT_PRICE_USD_PHASE_TWO,
  BIGNFT_PRICE_USD_PHASE_THREE,
  BUYING_WITH_IBAT_DISCOUNT,
  SLIPPAGE_FOR_BNB,
  SLIPPAGE_FOR_ETH
} from "../CONTRACT_DETAILS";
import { BSC_COINS_SUPPORTED, ETH_COINS_SUPPORTED } from "../COINS_SUPPORTED";
import { useState, useCallback, useEffect } from "react";
import {
  useMoralis,
  useERC20Balances,
  useNativeBalance,
  useChain,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { Moralis } from "moralis-v1";

function BuyToken({
  toast,
  showErrToast,
  showInfoToast,
  isLargerThan500,
  setReRender,
  reRender,
  currentPhase,
  setCanBuyWithIbat,
  canBuyWithIbat,
  setNativeValue,
}) {
  /**
   * Moralis : START
   */
  const { isAuthenticated, isWeb3Enabled, user } = useMoralis();
  const { fetch: bigFetch } = useWeb3ExecuteFunction();
  const { data: allBalances, isLoading: isLoadingERC20Balances } =
    useERC20Balances(); // Fetch ERC20Balances

  const { chainId } = useChain(); // Fetch current chainId
  const { data: nativeBalance } = useNativeBalance({ chain: chainId }); // Fetch Native Balance
  /**
   * Moralis : END
   */

  /**
   * START
   * calculates if Hardcap of amount raised with IBAT is completed or not
   */
  const USDRaisedWithIBAT = useCallback(async () => {
    if (chainId === "0x1")
      return;
    const fnName = "totalIBATUSDvalueSold";
    let options = {
      abi: ABI_BIGNFT,
      contractAddress: NFT_CONTRACT_ADDRESS_PHASE,
      functionName: fnName,
    };
    await bigFetch({
      params: options,
      onSuccess: (data) => {
        const amountRaisedIBAT = Number(data._hex);
        console.log(
          `💰💰 amountRaised - ${typeof amountRaisedIBAT} ${amountRaisedIBAT} - Phase${currentPhase} - ${!(
            amountRaisedIBAT < IBAT_HARDCAP_IN_USD
          )}`
        );
        // console.log(amountRaisedIBAT);
        if (!(amountRaisedIBAT < IBAT_HARDCAP_IN_USD)) setCanBuyWithIbat(false);
      },
      onError: (err) => {
        console.error(err);
        console.error(`dev-❌failed to USDRaisedWithIBAT()`);
      },
    });
  }, [currentPhase, bigFetch, setCanBuyWithIbat, chainId]);

  useEffect(() => {
    if (!isWeb3Enabled) return;
    USDRaisedWithIBAT();
  }, [isWeb3Enabled, USDRaisedWithIBAT]);
  /**
   * calculates if Hardcap of amount raised with IBAT is completed or not
   * END
   */

  const [buyingCoin, setBuyingCoin] = useState("BNB");
  const [buyingCoinAmount, setBuyingCoinAmount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [buyingCoinBalance, setBuyingCoinBalance] = useState(0);
  const [bigNFTBalance, setBigNFTBalance] = useState("0");

  useEffect(() => {
    // console.log("chainId", chainId);
    if (chainId === "0x1")
      setBuyingCoin("ETH");
    else
      setBuyingCoin("BNB");
    // alert('a');
  }, [chainId]);

  const getTokenBalanceInWei = useCallback(() => {
    let token = buyingCoin;
    let tempCoin = 0;
    if (!isAuthenticated) {
      console.error(`dev-not authenticated`);
      return;
    }
    if (token === "BNB" || token === "ETH") {
      return nativeBalance.balance;
    } else {
      tempCoin = allBalances.filter((c) => {
        let symbol = c.symbol + "";
        return symbol.toUpperCase() === token.toUpperCase();
      });
      console.log(`getting bal of - ${token}`);
      tempCoin = tempCoin && tempCoin[0] ? tempCoin[0] : null;
      tempCoin = tempCoin && tempCoin.balance;
      tempCoin += "";
    }

    return tempCoin;
  }, [allBalances, isAuthenticated, buyingCoin, nativeBalance]);

  // const gsetTokenPriceInUSD = useCallback(async () => {
  //   let fnName = `get${buyingCoin}LatestPrice`;
  //   let c = buyingCoin;
  //   const decimals = BSC_COINS_SUPPORTED.filter((e) => e.symbol === c)[0]
  //     .decimal;
  //   let options = {
  //     abi: ABI_BIGNFT,
  //     contractAddress: NFT_CONTRACT_ADDRESS_PHASE[1],
  //     functionName: fnName,
  //   };
  //   let price = 0;
  //   await bigFetch({
  //     params: options,
  //     onSuccess: (tx) => {
  //       if (tx) {
  //         price = Number(tx._hex) + "";
  //         price = Moralis.Units.FromWei(price, decimals);
  //         price = Number(price).toFixed(3) + "";
  //         // price = parseInt(price) + "";
  //       }
  //     },
  //     onError: (err) => {
  //       console.error(err);
  //       console.error(`dev-failed get getToken{-${c}-}PriceInUSD - ${fnName}`);
  //     },
  //   });
  //   return price;
  // }, [bigFetch, buyingCoin]);

  /**
   * START
   * get IBAT/BNB price
   */

  const getTokenPriceInUSD = useCallback(async () => {
    if (!buyingCoin || !BSC_COINS_SUPPORTED || !ETH_COINS_SUPPORTED) return;
    let c = buyingCoin;

    let fnName = `get${buyingCoin}LatestPrice`;
    if (chainId === "0x1")
      fnName = 'getBNBLatestPrice';
    // const decimals =
    //   "" + BSC_COINS_SUPPORTED.filter((e) => e.symbol === c)[0].decimal;
    let decimals = buyingCoin === "IBAT" ? 9 : 18; // BNB & IBAT
    if (buyingCoin === "USDT")
      decimals = 6;

    let options = {
      abi: chainId === "0x1" ? ABI_BATSPresale_ETH : ABI_BIGNFT,
      contractAddress: chainId === "0x1" ? ETH_NFT_CONTRACT_ADDRESS : NFT_CONTRACT_ADDRESS_PHASE,
      functionName: fnName,
    };
    let userTokenBalInWei = getTokenBalanceInWei(buyingCoin);
    userTokenBalInWei = userTokenBalInWei ? userTokenBalInWei : 0;
    // userTokenBal = Moralis.Units.Token(`${userTokenBal}`, decimals);
    let userTokenBal = Moralis.Units.FromWei(userTokenBalInWei, decimals);

    if (c === "IBAT") {
      options = {
        ...options,
        functionName: fnName,
        params: {
          _amountIN: `${Math.round(userTokenBal)}`,
        },
      };
    }

    // console.log(`decimals - ${userTokenBal} - ${typeof userTokenBal}`);
    // console.log(userTokenBal);
    // return 777;
    let coinPrice = 0;
    let USDEqu = "0";
    // console.log(options);
    await bigFetch({
      params: options,
      onSuccess: (data) => {
        if (!data) return;

        if (c === "IBAT") {
          // IBAT
          // USDEqu = data._hex ? `${Number(data._hex)}` : "0";
          USDEqu = data._hex || "0";
          USDEqu = Moralis.Units.FromWei(USDEqu, "18"); // return value is in USDT so - 18 decimals
          // console.log(`USDEqu - ${USDEqu}`);
          // console.log(`👻 ${c} cost - ${Math.round(USDEqu)}`);
        } else {
          coinPrice = Moralis.Units.FromWei(data._hex, decimals);
          USDEqu = coinPrice * userTokenBal;
        }
        USDEqu = Number(USDEqu).toFixed(2);
        USDEqu += "";
        // if (c === "IBAT") {
        //   decimals = "9";
        //   USDEqu = coinPrice * Math.round(maxSold);
        // }
      },
      onError: (err) => {
        console.error(err);
        console.error(`dev-failed getLatestPrice of token - ${fnName}`);
      },
    });
    // console.log(`👻 ${c} price = ${coinPrice} - ${USDEqu}`);
    return USDEqu;
  }, [bigFetch, buyingCoin, getTokenBalanceInWei, chainId]);

  /**
   * END
   * get IBAT/BNB price
   */

  const setMaxTokensPossibleToBuy = useCallback(async () => {
    // deducting 1IBAT from overall amount so that total no. of holders doesn't decrease coz they're staking MAX AMOUNT - making IBAT Holding = 0 IBAT
    const TO_MAINTAIN_WALLET_HOLDERS = 1;

    let e = 0;
    try {
      e = getTokenBalanceInWei(buyingCoin);
      if (buyingCoin.toUpperCase() === "IBAT") e -= TO_MAINTAIN_WALLET_HOLDERS;
      e += "";
    } catch (error) {
      console.error(error);
      console.error(`dev-setMaxTokensPossibleToBuy crashed `);
    }
    if (!e || e <= 0 || e === "null") {
      e = "0";
    }

    let maxBATSPurchsePossible = 0;
    let BatsPrice = BIGNFT_PRICE_USD_PHASE_ONE;
    if (currentPhase === "2") {
      BatsPrice = BIGNFT_PRICE_USD_PHASE_TWO;
    } else if (currentPhase === "3") {
      BatsPrice = BIGNFT_PRICE_USD_PHASE_THREE;
    }
    if (buyingCoin === "IBAT" || buyingCoin === "BNB" || buyingCoin === "ETH") {
      let buyingCoinPriceInUSD = await getTokenPriceInUSD();
      // @todo calculate IBAT price
      // console.log(buyingCoinPriceInUSD);
      let preDiscountPrice = (100 - BUYING_WITH_IBAT_DISCOUNT) / 100;
      maxBATSPurchsePossible = parseInt(
        buyingCoinPriceInUSD / (preDiscountPrice * BatsPrice)
      );
      if (buyingCoin === "BNB") {
        let preSlippagePrice =
          buyingCoinPriceInUSD / (SLIPPAGE_FOR_BNB * BatsPrice);
        maxBATSPurchsePossible = parseInt(preSlippagePrice);
      } // maxBATSPurchsePossible = maxBATSPurchsePossible / BatsPrice;
      else if (buyingCoin === "ETH") {
        let preSlippagePrice =
          buyingCoinPriceInUSD / (SLIPPAGE_FOR_ETH * BatsPrice);
        maxBATSPurchsePossible = parseInt(preSlippagePrice);
      }
    } else if (
      buyingCoin === "USDT" ||
      buyingCoin === "BUSD" ||
      buyingCoin === "DAI" ||
      buyingCoin === "USDC"
    ) {
      // console.log(`🥵🥵🥵`);
      // console.log(typeof e);
      // console.log(e);
      // console.log(`🥵🥵🥵🥵🥵`);
      if (buyingCoin === "USDT")
        e = Moralis.Units.FromWei(`${e}`, "6");
      else
        e = Moralis.Units.FromWei(`${e}`, "18");
      e = Number(e).toFixed(3) + "";
      e = parseInt(e) + "";
      maxBATSPurchsePossible = parseInt(e / BatsPrice);
    }

    // console.log(typeof currentPhase);
    // console.log(currentPhase === "1");
    let input = document.getElementById("buyingCoinAmount");
    try {
      setNativeValue(input, maxBATSPurchsePossible);
      // setNativeValue(input, e);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (error) {
      console.error(error);
      console.log(input);
      console.log(typeof e);
      console.log(e);
      console.error(`dev-failed to setMaxAmount()`);
    }
  }, [
    currentPhase,
    buyingCoin,
    getTokenBalanceInWei,
    getTokenPriceInUSD,
    setNativeValue,
  ]);

  const getBalanceFromContract = useCallback(
    async (contractAdd) => {
      let fnName = "userDeposits";
      let userAddress = user.get("ethAddress");


      let options = {
        abi: chainId === "0x1" ? ABI_BATSPresale_ETH : ABI_BIGNFT,
        contractAddress: contractAdd,
        functionName: fnName,
        params: {
          "": userAddress,
        },
      };

      let bal = 0;
      await bigFetch({
        params: options,
        onSuccess: (tx) => {
          if (tx) {
            bal = Number(tx._hex) + "";
            bal = Moralis.Units.FromWei(bal, 18);
            bal = Number(bal).toFixed(3) + "";
            bal = parseInt(bal) + "";
          }
        },
        onError: (err) => {
          console.error(err);
          console.error(`dev-failed get bignftbalance - ${fnName}`);
        },
      });
      return bal;
    },
    [bigFetch, user, chainId]
  );

  const getBigNFTBalance = useCallback(async () => {
    if (!isWeb3Enabled || !user) return;
    // console.log(
    //   `reRender[${reRender}] changed, so updating values(getBigNFTBalance)`
    // );

    let bal = 0;
    if (chainId === "0x1")
      bal += Number(await getBalanceFromContract(ETH_NFT_CONTRACT_ADDRESS));
    else {
      bal += Number(await getBalanceFromContract(NFT_CONTRACT_ADDRESS_PHASE));
      // bal += Number(await getBalanceFromContract(NFT_CONTRACT_ADDRESS_PHASE[2]));
      // bal += Number(await getBalanceFromContract(NFT_CONTRACT_ADDRESS_PHASE[3]));
    }
    bal += "";
    // console.log(`🤡🤡🤡`);
    // console.log(typeof bal);
    // console.log(`bal - ${bal}`);
    // console.log(`🤡🤡🤡`);
    setBigNFTBalance(bal);
  }, [isWeb3Enabled, user, reRender, getBalanceFromContract, chainId]);

  useEffect(() => {
    getBigNFTBalance();
  }, [getBigNFTBalance]);

  return (
    <Flex
      width={"full"}
      justifyContent="space-between"
      gap={"1rem"}
      marginTop="2rem"
      padding={"1rem"}
      direction={isLargerThan500 ? "row" : "column"}
    >
      <Flex
        width={isLargerThan500 ? "50%" : "full"}
        direction="column"
        alignItems={"flex-start"}
        gap=".5rem"
      >
        <Heading as="h3" fontSize={"1.5rem"} minWidth="max-content">
          Payment Method
        </Heading>
        <Flex
          direction={"column"}
          gap="1rem"
          maxWidth={"500px"}
          width="full"
          padding={"1rem .5rem"}
          borderRadius="4px"
          backdropFilter="blur(2px)"
        >
          <CoinSelector
            dropDownLabel={"Buy with"}
            coin={buyingCoin}
            setCoin={setBuyingCoin}
            coinBalance={buyingCoinBalance}
            isAuthenticated={isAuthenticated}
            isLoadingERC20Balances={isLoadingERC20Balances}
            allBalances={allBalances}
            nativeBalance={nativeBalance}
            canBuyWithIbat={canBuyWithIbat}
          />

          <InputAmount
            elID="buyingCoinAmount"
            setAmount={setBuyingCoinAmount}
            setRightButtonAction={setMaxTokensPossibleToBuy}
          />
          <BuyButton
            coin={buyingCoin}
            bigNFTAmount={buyingCoinAmount}
            toast={toast}
            showErrToast={showErrToast}
            showInfoToast={showInfoToast}
            setReRender={setReRender}
            reRender={reRender}
            currentPhase={currentPhase}
          ></BuyButton>
        </Flex>
      </Flex>
      <Flex
        width={isLargerThan500 ? "50%" : "full"}
        direction="column"
        alignItems={"flex-start"}
        gap=".5rem"
      >
        <Heading as="h3" fontSize={"1.5rem"} minWidth="max-content">
          Token Details
        </Heading>
        <Flex
          background={
            "linear-gradient(90deg, rgba(23, 44, 102, 0.3) 0%, rgba(24, 22, 82, 0.3) 100%)"
          }
          borderRadius="4px"
          border={"2px solid rgba(255, 255, 255, 0.27)"}
          padding="1rem"
          width="full"
          direction={"column"}
          gap="1rem"
        >
          <Flex
            direction={"column"}
            alignItems="flex-start"
            paddingBottom=".5rem"
            marginBottom=".5rem"
            borderBottom={"1px solid #434343"}
          >
            <Text fontWeight={"bold"} fontSize=".85rem">
              {NFT_TOKEN_SYMBOL} Balance
            </Text>
            <Text>{bigNFTBalance}</Text>
          </Flex>
          <Flex direction={"column"} alignItems="flex-start">
            <Text fontWeight={"bold"} fontSize=".85rem">
              Total Supply
            </Text>
            <Text>100,000,000</Text>
          </Flex>
          <Flex direction={"column"} alignItems="flex-start">
            <Text fontWeight={"bold"} fontSize=".85rem">
              $IBAT Contract Address
            </Text>
            <Text overflowWrap={"anywhere"} textAlign="left">
              0x19cd9b8e42d4ef62c3ea124110d5cfd283ceac43
            </Text>
          </Flex>
          <Flex direction={"column"} alignItems="flex-start">
            <Text fontWeight={"bold"} fontSize=".85rem">
              Token Decimals
            </Text>
            <Text>18</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default BuyToken;
