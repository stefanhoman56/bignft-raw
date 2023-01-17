import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Image,
  Text,
  useToast,
  useMediaQuery,
  useDisclosure,
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  CloseButton,
} from "@chakra-ui/react";
import Timer from "./Timer";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Moralis } from "moralis-v1";
import ProgressBar2 from "./ProgressBar2";
import ConnectWalletDrawer from "./ConnectWalletDrawer";
import BuyToken from "./BuyToken";
import iconHelp from "../assets/iconHelp.svg";
import {
  BIGNFT_PRICE_USD_PHASE_ONE,
  BIGNFT_PRICE_USD_PHASE_THREE,
  BIGNFT_PRICE_USD_PHASE_TWO,
  BUYING_WITH_IBAT_DISCOUNT,
  NFT_TOKEN_SYMBOL,
  ABI_BIGNFT,
  NFT_CONTRACT_ADDRESS_PHASE,
} from "../CONTRACT_DETAILS";
import {
  TRANSAK_QUERY_PARAMETERS,
  TRANSAK_SRC_URL,
  TRANSAK_KYB_IS_DONE,
} from "../TRANSAK_DETAILS";

import { ref, getDatabase } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import InputAmount from "./InputAmount";

function Hero({
  login,
  setReRender,
  reRender,
  firebaseApp,
  currentPhase,
  currentPhase_loading,
}) {
  /**
   * TOAST : START
   */
  const toast = useToast();
  const showWarnToast = useCallback(
    (errTitle, errMsg) => {
      toast({
        containerStyle: {
          maxWidth: "92vw",
        },
        title: errTitle,
        description: errMsg ? errMsg : "",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );
  const showErrToast = useCallback(
    (errTitle, errMsg) => {
      toast({
        containerStyle: {
          maxWidth: "92vw",
        },
        title: errTitle,
        description: errMsg ? errMsg : "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );
  const showInfoToast = useCallback(
    (errTitle, errMsg) => {
      toast({
        containerStyle: {
          maxWidth: "92vw",
        },
        title: errTitle,
        description: errMsg ? errMsg : "",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );
  // const showSuccessToast = useCallback(
  //   (errTitle, errMsg) => {
  //     toast({
  //       containerStyle: {
  //         maxWidth: "92vw",
  //       },
  //       title: errTitle,
  //       description: errMsg ? errMsg : "",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   },
  //   [toast]
  // );
  /**
   * TOAST : END
   */

  const setNativeValue = useCallback((element, value) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value"
    ).set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }, []);

  const database = getDatabase(firebaseApp);

  const [raisedInCurrentPhaseDB, raisedInCurrentPhaseDB_loading] = useObject(
    ref(database, "raisedInPhase")
  );
  const [raisedInCurrentPhase, setRaisedInCurrentPhase] = useState("");
  useEffect(() => {
    if (raisedInCurrentPhaseDB_loading || currentPhase_loading || !currentPhase)
      return;
    setRaisedInCurrentPhase(raisedInCurrentPhaseDB.val()[currentPhase]);
  }, [
    currentPhase,
    currentPhase_loading,
    raisedInCurrentPhaseDB,
    raisedInCurrentPhaseDB_loading,
  ]);

  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  const { isAuthenticated, isWeb3EnableLoading, isWeb3Enabled, enableWeb3 } =
    useMoralis();
  const { fetch: bigFetch, isFetching } = useWeb3ExecuteFunction();
  useEffect(() => {
    // if (!isWeb3EnableLoading) {
    //   showInfoToast("Connecting to Web3 instance...");
    // }
    if (isWeb3Enabled) {
      console.log(`🟢web3 enabled`);
      // showInfoToast("Web3 Enabled");
      toast.closeAll();
    } else {
      console.log(`🔴web3 not enabled`);
      // showWarnToast("Web3 not enabled");
    }
  }, [isWeb3EnableLoading, showInfoToast, isWeb3Enabled, toast, showWarnToast]);
  useEffect(() => {
    let e = async () => {
      console.log(`🔵web3 enabling...`);
      await enableWeb3();
    };
    e();
  }, [enableWeb3]);

  const [canBuyWithIbat, setCanBuyWithIbat] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [BNBAmountForBuyingIBAT, setBNBAmountForBuyingIBAT] = useState("0");
  const confirmBuyIbat = useCallback(() => {
    if (
      !isWeb3Enabled ||
      !isAuthenticated ||
      Number(BNBAmountForBuyingIBAT) <= 0
    ) {
      console.log(`isWeb3Enabled - ${isWeb3Enabled}`);
      if (!isWeb3Enabled)
        showErrToast(
          "Web3 not enabled",
          "Try Refreshing or disconnect & connect again."
        );
      if (!isAuthenticated)
        showErrToast(
          "Wallet Connection Issue",
          "Try Refreshing or disconnect & connect again."
        );
      if (Number(BNBAmountForBuyingIBAT) <= 0) {
        showInfoToast(`BNB Amount can not be ${BNBAmountForBuyingIBAT}`);
      }
      return;
    }
    onOpen();
  }, [
    isWeb3Enabled,
    isAuthenticated,
    BNBAmountForBuyingIBAT,
    onOpen,
    showErrToast,
    showInfoToast,
  ]);
  const buyIbatWithBNB = useCallback(() => {
    console.log(`👛👛Buy IBAT worth ${BNBAmountForBuyingIBAT} BNB👛👛`);
    const fnName = "buyIBAT";
    let options = {
      abi: ABI_BIGNFT,
      contractAddress: NFT_CONTRACT_ADDRESS_PHASE,
      functionName: fnName,
      msgValue: Moralis.Units.ETH(`${BNBAmountForBuyingIBAT}`),
    };
    console.log(options);

    bigFetch({
      params: options,
      onSuccess: (tx) => {
        onClose();
        let buyBNBwithIBATElement = document.getElementById("buyingIBATAmount");
        setNativeValue(buyBNBwithIBATElement, "");
        buyBNBwithIBATElement.dispatchEvent(
          new Event("input", { bubbles: true })
        );
        setBNBAmountForBuyingIBAT("0");
        console.log(tx);
        toast({
          containerStyle: {
            maxWidth: "92vw",
          },
          title: `Buying IBAT worth ${BNBAmountForBuyingIBAT}BNB. Tx in progress...`,
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
            title: `Success. Bought IBAT worth ${BNBAmountForBuyingIBAT}BNB`,
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
        console.error(`dev-❌failed to buyIbatWithBNB()`);
      },
    });
  }, [
    BNBAmountForBuyingIBAT,
    bigFetch,
    onClose,
    reRender,
    setNativeValue,
    setReRender,
    showErrToast,
    toast,
  ]);

  const [onRampVisibility, setonRampVisibility] = useState(false);
  const toggleCryptoOnRamp = useCallback(() => {
    const onRampIframe = document.getElementById("fiatOnRampiFrame");
    let userAddress = localStorage.getItem("BIGNFT_userAddress");
    let queryParams = `&${TRANSAK_QUERY_PARAMETERS}&walletAddress=${userAddress}`;
    let newURL = TRANSAK_SRC_URL + queryParams;

    onRampIframe.setAttribute("src", newURL);
    console.log();
    const onRampEl = document.getElementById("fiatOnRamp");
    if (!onRampVisibility) {
      onRampEl.style.display = "flex";
      setonRampVisibility(true);
    } else {
      onRampEl.style.display = "none";
      setonRampVisibility(false);
    }
  }, [onRampVisibility]);

  return (
    <>
      <Flex
        direction={"column"}
        color="#DDCDEA"
        justifyContent="center"
        border="4px solid rgba(255, 255, 255, 0.2)"
        borderRadius={"16px"}
        background="linear-gradient(90deg, rgba(52, 18, 64, 0.5) 0%, rgba(0, 31, 78, 0.5) 51.04%, rgba(35, 20, 68, 0.5) 100%)"
        padding={"2rem .5rem"}
        backdropFilter="blur(5px)"
        maxWidth={isLargerThan500 ? "" : "100%"}
        width={isLargerThan500 ? "" : "100%"}
      >
        <Text
          as="h1"
          textTransform={"uppercase"}
          fontWeight="black"
          fontSize={isLargerThan500 ? "2rem" : "1.3rem"}
          fontFamily={"Russo One"}
        >
          Buy {NFT_TOKEN_SYMBOL} on presale
        </Text>
        <Text
          textTransform={"uppercase"}
          fontSize={".8rem"}
          fontFamily={"Russo One"}
        >
          Phase{" "}
          {!currentPhase_loading && currentPhase ? `${currentPhase}` : "..."}
        </Text>
        <Text
          textTransform={"uppercase"}
          fontSize={".8rem"}
          fontFamily={"Russo One"}
        >
          SOLD -{` $${raisedInCurrentPhase}`}
        </Text>
        <Text
          as="h2"
          textTransform={"uppercase"}
          fontSize={isLargerThan500 ? "1.2rem" : "1rem"}
        >
          1 {NFT_TOKEN_SYMBOL} ={" $"}
          {!currentPhase_loading && currentPhase
            ? currentPhase === "1"
              ? BIGNFT_PRICE_USD_PHASE_ONE
              : currentPhase === "2"
                ? BIGNFT_PRICE_USD_PHASE_TWO
                : BIGNFT_PRICE_USD_PHASE_THREE
            : "..."}
        </Text>
        <Text
          textTransform={"uppercase"}
          fontSize={".8rem"}
          fontFamily={"Russo One"}
          paddingTop={".3rem"}
        >
          PRICE INCREASES IN NEXT PHASE
        </Text>
        <ProgressBar2
          firebaseApp={firebaseApp}
          isLargerThan500={isLargerThan500}
          currentPhase={currentPhase}
        ></ProgressBar2>

        {!isAuthenticated ? (
          <Flex
            gap={"1rem"}
            margin=".5rem auto"
            marginBottom={"1rem"}
            direction={isLargerThan500 ? "row" : "column"}
          >
            <ConnectWalletDrawer login={login} />

            <Button
              textTransform="uppercase"
              fontWeight={"black"}
              borderRadius="4px"
              boxShadow={"2px 2px 23px rgba(0, 0, 0, 0.3)"}
              padding=".75rem 1.5rem"
            >
              <Image src={iconHelp} marginRight=".5rem" />
              How to Buy
            </Button>
          </Flex>
        ) : (
          ""
        )}
        <Timer isLargerThan500={isLargerThan500} currentPhase={currentPhase} />
        {isAuthenticated ? (
          <BuyToken
            toast={toast}
            showErrToast={showErrToast}
            showInfoToast={showInfoToast}
            isLargerThan500={isLargerThan500}
            setReRender={setReRender}
            reRender={reRender}
            currentPhase={currentPhase}
            canBuyWithIbat={canBuyWithIbat}
            setCanBuyWithIbat={setCanBuyWithIbat}
            setNativeValue={setNativeValue}
          />
        ) : (
          ""
        )}
        {canBuyWithIbat && (
          <Flex
            justifyContent={TRANSAK_KYB_IS_DONE ? "space-around" : "flex-start"}
            direction={isLargerThan500 ? "row" : "column"}
            gap={"2rem"}
            marginTop={isLargerThan500 ? "0" : "3rem"}
          >
            <Flex direction={"column"} gap=".5rem">
              <Text
                margin={"auto"}
                padding=".25rem 1rem"
                paddingLeft={".25rem"}
                paddingBottom={"0"}
                width={"full"}
                fontSize="sm"
                borderRadius={"md"}
              >
                Get{" "}
                <Badge colorScheme={"green"} fontWeight="bold">
                  {BUYING_WITH_IBAT_DISCOUNT}% discount
                </Badge>{" "}
                when buying with IBAT
              </Text>
              <InputAmount
                elID="buyingIBATAmount"
                leftLabel={"BNB"}
                placeHolder={"Buy IBAT with BNB"}
                rightLabel={"BUY IBAT"}
                setAmount={setBNBAmountForBuyingIBAT}
                setRightButtonAction={confirmBuyIbat}
              />
            </Flex>

            {TRANSAK_KYB_IS_DONE && (
              <Flex direction={"column"} gap=".5rem">
                <Text
                  margin={"auto"}
                  padding=".25rem 1rem"
                  paddingLeft={"0.25rem"}
                  paddingBottom={"0"}
                  width={"full"}
                  fontSize="sm"
                  borderRadius={"md"}
                >
                  Not enough BNB? Buy with FIAT(USD, GBP, etc)
                </Text>
                <Button variant={"solid"} onClick={toggleCryptoOnRamp}>
                  BUY BNB
                </Button>
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
      <Flex
        position={"fixed"}
        width={"100vw"}
        height="100vh"
        top={"0"}
        left={"0"}
        background="#00000099"
        backdropFilter={"blur(5px)"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"1rem"}
        padding={"1rem"}
        display={"none"}
        id="fiatOnRamp"
        direction={"column"}
      >
        <CloseButton
          size={"lg"}
          marginLeft={"auto"}
          onClick={toggleCryptoOnRamp}
        />
        <iframe
          height="625"
          id="fiatOnRampiFrame"
          title="Fiat OnRamp Widget"
          src={TRANSAK_SRC_URL}
          allowtransparency="true"
          style={{
            width: "100%",
            maxHeight: "625px",
            maxWidth: "500px",
          }}
        ></iframe>
        <Button width={"16rem"} onClick={toggleCryptoOnRamp}>
          Close
        </Button>
      </Flex>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy IBAT with BNB</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"}>
              <Flex>
                <Text>You're about to buy IBAT worth &nbsp;</Text>
                <Text fontWeight={"bold"}> {BNBAmountForBuyingIBAT} BNB.</Text>
              </Flex>
              <Text>Confirm that you want to buy.</Text>
            </Flex>
          </ModalBody>
          <ModalFooter gap={"1rem"}>
            <Button variant={"ghost"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isFetching}
              onClick={buyIbatWithBNB}
              variant="solid"
            >
              BUY IBAT
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Hero;
