import { Button, Badge, Text, Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useWeb3ExecuteFunction, useMoralis, useChain } from "react-moralis";
import { BSC_COINS_SUPPORTED, ETH_COINS_SUPPORTED } from "../COINS_SUPPORTED";
import {
  NFT_CONTRACT_ADDRESS_PHASE,
  ABI_BIGNFT,
  SLIPPAGE_FOR_BNB,
  BIGNFT_PRICE_USD_PHASE_ONE,
  BUYING_WITH_IBAT_DISCOUNT,
  NFT_TOKEN_SYMBOL,
  MIN_BUYING_AMOUNT,
  ETH_NFT_CONTRACT_ADDRESS,
  ABI_BATSPresale_ETH,
  SLIPPAGE_FOR_ETH,
} from "../CONTRACT_DETAILS";
import { Moralis } from "moralis-v1";

function BuyButton({
  coin,
  bigNFTAmount,
  toast,
  showErrToast,
  showInfoToast,
  setReRender,
  reRender,
  currentPhase,
}) {
  /**
   * Moralis : START
   */
  const { fetch: bigFetch, isFetching: bigIsFetching } =
    useWeb3ExecuteFunction();
  const { isWeb3Enabled } = useMoralis();
  /**
   * Moralis : END
   */

  const [BNBValueForBIGNFT, setBNBValueForBIGNFT] = useState(0);
  const [USDEquivalent, setUSDEquivalent] = useState("0");
  const { chainId } = useChain(); // Fetch current chainId

  const buyBigNFT = useCallback(() => {
    // console.log(`Bought ${bigNFTAmount} BIGNFTs, using - ${coin}`);
    let buyingCoin = coin + "";
    buyingCoin = buyingCoin.toUpperCase();
    console.log(`trying to buy ${bigNFTAmount} ${NFT_TOKEN_SYMBOL} w/ ${coin}`);
    if (!bigNFTAmount || Number(bigNFTAmount) < MIN_BUYING_AMOUNT) {
      showInfoToast(
        `Minimum buying amount is ${MIN_BUYING_AMOUNT} ${NFT_TOKEN_SYMBOL}`
      );
      console.error(
        `dev-error Minimum buying amount is ${MIN_BUYING_AMOUNT}${NFT_TOKEN_SYMBOL}`
      );
      return;
    }

    let fnName = "buyWithIBAT";
    let buyParams = {
      amount: bigNFTAmount,
    };
    let options = {
      abi: chainId === "0x1" ? ABI_BATSPresale_ETH : ABI_BIGNFT,
      contractAddress: chainId === "0x1" ? ETH_NFT_CONTRACT_ADDRESS : NFT_CONTRACT_ADDRESS_PHASE,
      functionName: fnName,
      params: buyParams,
    };
    if (buyingCoin === "BNB") {
      console.log(`Bought ${bigNFTAmount} BIGNFTs, w/ BNB`);

      options = {
        ...options,
        msgValue: Moralis.Units.ETH(`${BNBValueForBIGNFT}`),
        functionName: "buyWithBNB",
      };
    } else if (buyingCoin === "ETH") {
      console.log(`Bought ${bigNFTAmount} BIGNFTs, w/ ETH`);

      options = {
        ...options,
        msgValue: Moralis.Units.ETH(`${BNBValueForBIGNFT}`),
        functionName: "buyWithBNB",
      };
    } else if (
      buyingCoin === "USDT" ||
      buyingCoin === "BUSD" ||
      buyingCoin === "DAI" ||
      buyingCoin === "USDC"
    ) {
      console.log(`Bought ${bigNFTAmount} ${NFT_TOKEN_SYMBOL}, w/ StableCoin`);
      let stableCoinIndex = 0; // for USDT
      if (buyingCoin === "USDC") {
        stableCoinIndex = 1;
      } else if (buyingCoin === "BUSD") {
        stableCoinIndex = 2;
      } else if (buyingCoin === "DAI") {
        stableCoinIndex = 3;
      }
      buyParams = {
        ...buyParams,
        purchaseToken: stableCoinIndex,
      };
      options = {
        ...options,
        functionName: "buyWithUSD",
        params: buyParams,
      };
    }

    // console.log(`-------`);
    // console.log(options);
    // console.log(`-------`);
    // return;

    bigFetch({
      params: options,
      onSuccess: (tx) => {
        console.log(tx);
        toast({
          containerStyle: {
            maxWidth: "92vw",
          },
          title: `Buying ${bigNFTAmount} ${NFT_TOKEN_SYMBOL} tokens Tx in progress...`,
          description: `Tx Hash : ${tx.hash}`,
          status: "info",
          duration: null,
          isClosable: true,
        });

        tx.wait().then((dataa) => {
          console.log(dataa);

          setReRender(!reRender); // for refreshing values
          // fetchERC20Balances();

          toast.closeAll();
          toast({
            containerStyle: {
              maxWidth: "92vw",
            },
            title: `Success. Bought ${bigNFTAmount} ${NFT_TOKEN_SYMBOL} tokens`,
            description: `Tx Hash : ${dataa.transactionHash}`,
            status: "success",
            duration: "10000",
            isClosable: true,
          });
        });
      },
      onError: (err) => {
        console.error(err);
        if (err && err.data) showErrToast(err.data.message);
        else if (err && err.message) showErrToast(err.message);
        console.error(`dev-failed buying BATTLESQUAD - ${NFT_TOKEN_SYMBOL}`);
      },
    });
  }, [
    coin,
    bigNFTAmount,
    bigFetch,
    BNBValueForBIGNFT,
    toast,
    reRender,
    showErrToast,
    showInfoToast,
    setReRender,
    chainId
  ]);

  const enableAllowance = useCallback(() => {
    let tokenToEnable = `${coin.toUpperCase()}`;
    console.log(`enableAllowance-`);
    console.log(tokenToEnable);
    if (chainId === "0x1") {
      console.log("yooo")
      let ABI_approve = ETH_COINS_SUPPORTED.filter(
        (e) => e.symbol.toUpperCase() === tokenToEnable
      )[0].ABI_approve;
      // console.log(ABI_approve);
      let tokenToEnableAllowanceContractAddress = ETH_COINS_SUPPORTED.filter(
        (e) => e.symbol.toUpperCase() === tokenToEnable
      )[0].bscContractAddress;


      let contractAddressToAllow = ETH_NFT_CONTRACT_ADDRESS;
      let optionsApprove = {
        abi: ABI_approve,
        contractAddress: tokenToEnableAllowanceContractAddress,
        functionName: "approve",
        params: {
          spender: contractAddressToAllow,
          amount: "100000000000000000000000000000",
        },
      };

      bigFetch({
        params: optionsApprove,
        onSuccess: (tx) => {
          console.log(tx);
          toast({
            containerStyle: {
              maxWidth: "92vw",
            },
            title: `Allowance for ${tokenToEnable} Tx in progress...`,
            description: `Tx Hash : ${tx.hash}`,
            status: "info",
            duration: null,
            isClosable: true,
          });

          tx.wait().then((dataa) => {
            console.log(dataa);
            console.log(`dev-✅-${tokenToEnable} allowance approved`);
            window.localStorage.setItem(`${tokenToEnable}allowance`, "true");
            console.log(window.localStorage.getItem(`${tokenToEnable}allowance`));

            setReRender(!reRender); // for refreshing values

            toast.closeAll();
            toast({
              containerStyle: {
                maxWidth: "92vw",
              },
              title: `${tokenToEnable} allowance enabled. For best Experience, disconnect & connect again.`,
              description: `Tx Hash : ${dataa.transactionHash}`,
              status: "success",
              duration: "10000",
              isClosable: true,
            });
          });
        },
        onError: (err) => {
          console.error(err);
          if (err && err.data) showErrToast(err.data.message);
          else if (err && err.message) showErrToast(err.message);
          console.error(`dev-failed ${tokenToEnable} allownace`);
        },
      });


    } else {
      let ABI_approve = BSC_COINS_SUPPORTED.filter(
        (e) => e.symbol.toUpperCase() === tokenToEnable
      )[0].ABI_approve;
      // console.log(ABI_approve);
      let tokenToEnableAllowanceContractAddress = BSC_COINS_SUPPORTED.filter(
        (e) => e.symbol.toUpperCase() === tokenToEnable
      )[0].bscContractAddress;


      let contractAddressToAllow = NFT_CONTRACT_ADDRESS_PHASE;
      let optionsApprove = {
        abi: ABI_approve,
        contractAddress: tokenToEnableAllowanceContractAddress,
        functionName: "approve",
        params: {
          spender: contractAddressToAllow,
          amount: "100000000000000000000000000000",
        },
      };

      bigFetch({
        params: optionsApprove,
        onSuccess: (tx) => {
          console.log(tx);
          toast({
            containerStyle: {
              maxWidth: "92vw",
            },
            title: `Allowance for ${tokenToEnable} Tx in progress...`,
            description: `Tx Hash : ${tx.hash}`,
            status: "info",
            duration: null,
            isClosable: true,
          });

          tx.wait().then((dataa) => {
            console.log(dataa);
            console.log(`dev-✅-${tokenToEnable} allowance approved`);
            window.localStorage.setItem(`${tokenToEnable}allowance`, "true");

            setReRender(!reRender); // for refreshing values

            toast.closeAll();
            toast({
              containerStyle: {
                maxWidth: "92vw",
              },
              title: `${tokenToEnable} allowance enabled. For best Experience, disconnect & connect again.`,
              description: `Tx Hash : ${dataa.transactionHash}`,
              status: "success",
              duration: "10000",
              isClosable: true,
            });
          });
        },
        onError: (err) => {
          console.error(err);
          if (err && err.data) showErrToast(err.data.message);
          else if (err && err.message) showErrToast(err.message);
          console.error(`dev-failed ${tokenToEnable} allownace`);
        },
      });
    }
  }, [
    bigFetch,
    coin,
    reRender,
    setReRender,
    showErrToast,
    toast,
    chainId
  ]);

  /**
   * START
   * Gets the amount of max sold coins required to buy given amount of BATTLESQUAD
   */
  const [maxSold, setMaxSold] = useState("0");
  const getMaxSold = useCallback(() => {
    let c = coin + "";
    c = c.toUpperCase();

    if (
      !bigNFTAmount ||
      Number(bigNFTAmount) < MIN_BUYING_AMOUNT ||
      c.length <= 0
    ) {
      setMaxSold("0");
      return;
    }

    let fnName = "getIBATAmount";
    if (c === "BNB" || c === "ETH") {
      fnName = "getBNBAmount";
      // @todo - add refresh - price updates after couple of seconds
    }
    let buyingPrice = 0;
    let options = {
      abi: chainId === "0x1" ? ABI_BATSPresale_ETH : ABI_BIGNFT,
      contractAddress: chainId === "0x1" ? ETH_NFT_CONTRACT_ADDRESS : NFT_CONTRACT_ADDRESS_PHASE,
      functionName: fnName,
      params: {
        amount: bigNFTAmount,
      },
    };

    // if buying w/ Stablecoin - then setMaxAmount same as USD amount coz $1={price from CONTRACT_DETAILS}
    if (c === "USDT" || c === "BUSD" || c === "USDC" || c === "DAI") {
      let t = (BIGNFT_PRICE_USD_PHASE_ONE * bigNFTAmount).toFixed(2);
      setMaxSold(t);
      return;
    }
    bigFetch({
      params: options,
      onSuccess: (tx) => {
        buyingPrice = Number(tx._hex) + "";
        if (c === "BNB") {
          buyingPrice = Number(tx._hex) * SLIPPAGE_FOR_BNB + "";
        }
        else if (c === "ETH") {
          buyingPrice = Number(tx._hex) * SLIPPAGE_FOR_ETH + "";
        }

        // console.log(buyingPrice);
        // const decimals = BSC_COINS_SUPPORTED.filter((e) => e.symbol === c)[0]
        //   .decimal;
        const decimals = c === "IBAT" ? "9" : "18";
        //   .decimal;
        console.log("buyingPrice", buyingPrice)
        buyingPrice = Moralis.Units.FromWei(buyingPrice, decimals);
        buyingPrice = Number(buyingPrice).toFixed(3) + "";
        if (c === "BNB" || c === "ETH") {
          try {
            setBNBValueForBIGNFT(buyingPrice);
          } catch (error) {
            console.error(`dev-error : setBNBValueForBIGNFT(buyingPrice);`);
          }
        }

        // console.log(
        //   `buyingPrice - ${buyingPrice} ${coin} - decimals [${decimals}] - for ${bigNFTAmount} ${NFT_TOKEN_SYMBOL}`
        // );
        setMaxSold(buyingPrice);
      },
      onError: (err) => {
        console.error(err);
        console.error(`dev-failed get price - ${fnName}`);
      },
    });
    // if(c.toUpperCase() === "IBAT"){

    // }
  }, [coin, bigNFTAmount, bigFetch, chainId]);

  // calls the setMaxSold everytime the amount of BATTLESQUAD to buy changes
  useEffect(() => {
    if (!isWeb3Enabled) return;
    getMaxSold();
  }, [isWeb3Enabled, getMaxSold]);

  /**
   * Gets the amount of max sold coins required to buy given amount of BATTLESQUAD
   * END
   */
  /**
   * START
   * get IBAT/BNB price
   */

  const getLatestPrice = useCallback(() => {
    let c = (coin + "").toUpperCase();

    let fnName = "getBNBLatestPrice";

    let options = {
      abi: chainId === "0x1" ? ABI_BATSPresale_ETH : ABI_BIGNFT,
      contractAddress: chainId === "0x1" ? ETH_NFT_CONTRACT_ADDRESS : NFT_CONTRACT_ADDRESS_PHASE,
      functionName: fnName,
    };
    if (c === "IBAT") {
      fnName = "getIBATLatestPrice";
      // _amountIN - is IBAT without decimals (13 IBAT, we'll pass 13, not 13000000000)
      // return value is in USDT so - 18 decimals
      options = {
        ...options,
        functionName: fnName,
        params: {
          _amountIN: `${Math.round(maxSold)}`,
        },
      };
      // options = {
      //   ...options,
      //   functionName: fnName,
      //   params: {
      //     _amountIN: Moralis.Units.Token(`${maxSold}`, "9"),
      //   },
      // };
      if (Number(maxSold) === 0) return;
    }

    // console.log(options);


    bigFetch({
      params: options,
      onSuccess: (data) => {
        if (!data) return;
        console.log("getLatestPrice===============", data)

        let decimals = c === "IBAT" ? "9" : "18";
        let USDEqu = "0";
        if (c === "BNB" || c === "ETH") {
          let coinPrice = Moralis.Units.FromWei(
            data._hex,
            decimals
          );
          USDEqu = coinPrice * maxSold;
        } else {
          // IBAT
          USDEqu = data._hex || "0";
          USDEqu = Moralis.Units.FromWei(USDEqu, "18"); // return value is in USDT so - 18 decimals
          // console.log(`👻 ${c} cost - ${Math.round(USDEqu)}`);
        }
        USDEqu = Number(USDEqu).toFixed(2);
        USDEqu += "";
        setUSDEquivalent(USDEqu);
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
  }, [coin, bigFetch, maxSold, chainId]);

  //  update price
  useEffect(() => {
    if (!isWeb3Enabled) return;
    getLatestPrice();
  }, [isWeb3Enabled, getLatestPrice]);
  /**
   * END
   * get IBAT/BNB price
   */

  return (
    <>
      <Button
        onClick={buyBigNFT}
        width={"full"}
        maxWidth={"340px"}
        margin={"auto"}
        disabled={
          window.localStorage.getItem(
            `BIGNFT_${coin.toUpperCase()}allowance`
          ) === "false" || bigIsFetching
        }
      >
        {bigIsFetching ? (
          "Sign Transaction in wallet"
        ) : (
          <>
            BUY&nbsp;
            <Text>{NFT_TOKEN_SYMBOL}</Text>
            {coin.toUpperCase() === "IBAT" && (
              <Badge ml={".5rem"} colorScheme={"green"}>
                {BUYING_WITH_IBAT_DISCOUNT}% Discount
              </Badge>
            )}
          </>
        )}
      </Button>
      {window.localStorage.getItem(`BIGNFT_${coin.toUpperCase()}allowance`) ===
        "false" && (
          <Button disabled={bigIsFetching} onClick={enableAllowance}>
            ENABLE {coin}
          </Button>
        )}
      <Flex justifyContent={"space-between"}>
        <Text fontSize={"x-small"}>Max Sold</Text>
        <Text fontSize={"x-small"} textAlign="right">
          {maxSold} {coin}{" "}
          {(coin + "").toUpperCase() === "BNB" || (coin + "").toUpperCase() === "ETH"
            ? `(${parseFloat(
              ((SLIPPAGE_FOR_BNB - 1) * 100).toFixed(2)
            )}% SLIPPAGE)`
            : ""}{" "}
          <br />
          {(coin + "").toUpperCase() === "BNB" ||
            (coin + "").toUpperCase() === "ETH" ||
            (coin + "").toUpperCase() === "IBAT"
            ? `$${Number(USDEquivalent)}`
            : ""}
        </Text>
      </Flex>
    </>
  );
}

export default BuyButton;
