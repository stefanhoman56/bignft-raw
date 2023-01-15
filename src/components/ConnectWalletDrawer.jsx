import {
  Button,
  ButtonGroup,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Flex,
  Text,
  Badge,
  Spacer,
  Spinner,
  useMediaQuery,
} from "@chakra-ui/react";
import CloseIcon from "../assets/close.svg";
import walletMM from "../assets/wallet-mm.svg";
import walletWC from "../assets/wallet-wc.svg";
import { useMoralis, useChain } from "react-moralis";
import { useCallback } from "react";
import { BSC_COINS_SUPPORTED } from "../COINS_SUPPORTED";


function ConnectWalletDrawer({ addClass, login }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  const {
    isAuthenticated,
    isAuthenticating,
    user,
    isWeb3Enabled,
    logout,
    enableWeb3,
  } = useMoralis();
  const { switchNetwork, chainId, chain } = useChain();

  const switchChain = useCallback((chId) => {
    console.log(`Switching Chain...`);
    try {
      if (isWeb3Enabled) {
        switchNetwork(chId);
        console.log(`Switching Chain...Success`);
      } else {
        enableWeb3();
      }
    } catch (error) {
      console.error(error);
      console.error(`dev-switchchain failed`);
    }
  }, [enableWeb3, isWeb3Enabled, switchNetwork]);

  const handleAuth = async (e) => {
    // setIsAuthenticated(true);
    if (e === "logout") {
      await logout();
      // setAllowance(false);
      BSC_COINS_SUPPORTED.forEach((token) => {
        console.log(`Removing - BIGNFT_${token.symbol.toUpperCase()}allowance`);
        window.localStorage.removeItem(
          `BIGNFT_${token.symbol.toUpperCase()}allowance`
        );
      });

      window.localStorage.setItem("BIGNFT_userAddress", "");
      window.localStorage.removeItem("BIGNFT_userAddress");
      console.log(`Logged Out`);
      return;
    }
    if (!isAuthenticated) {
      console.log(`Wallet wasn't connected`);
      console.log(`Trying to connect wallet`);
      console.log(`Provider =`);
      console.log(e);
      console.log(e === "walletconnect");
      try {
        if (e === "walletconnect") {
          console.log(`Logging with WC - drawer`);
          console.log(e);
          await login(e);
          console.log(`Wallet connected with WC`);
        } else {
          // metamask
          await login();
          console.log(`Wallet connected with MM`);
        }
      } catch (error) {
        console.log(error);
        console.error(`dev:issue Wallet connected`);
      }
    }
  };

  const btnClasses = `btn btn__connect_wallet btn-gradient-2 ${addClass}`;

  return (
    <>
      <Button
        className={btnClasses}
        onClick={onOpen}
        background={
          "linear-gradient(90deg, #7100DC 0%, #FF6A57 100.23%), linear-gradient(90.18deg, #003E9B 0.15%, #AD53CC 99.85%), rgba(10, 13, 56, 0.8);"
        }
        textTransform="uppercase"
        fontStyle={"italic"}
        fontWeight={"black"}
        borderRadius="4px"
        boxShadow={"2px 2px 23px rgba(0, 0, 0, 0.3)"}
        padding={isLargerThan500 ? ".75rem 1.5rem" : ".75rem"}
      >
        {!isAuthenticated
          ? `Connect Wallet`
          : user &&
          `${user
            .get("ethAddress")
            .toString()
            .substring(0, isLargerThan500 ? 5 : 4)}
            ...
            ${user
            .get("ethAddress")
            .toString()
            .substring(
              user.get("ethAddress").length - 1,
              user.get("ethAddress").length - (isLargerThan500 ? 6 : 5)
            )}`}
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} size={"sm"} bg="Red">
        <DrawerOverlay />

        <DrawerContent
          bg="rgba(29, 21, 54, 0.8)"
          style={{
            backdropFilter: "blur(4px)",
            boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          <DrawerHeader borderBottomWidth="1px">Connect Wallet</DrawerHeader>
          <DrawerBody>
            <Flex flexDir="column" gap="1rem" h="100%">
              <Flex flexDir="column">
                <Text fontSize="xs">Status</Text>
                <Text>
                  <Badge colorScheme={isAuthenticated ? "green" : "red"}>
                    {isAuthenticated ? "Connected" : "Disconnected"}
                  </Badge>
                </Text>
              </Flex>
              <Flex flexDir="column">
                <ButtonGroup gap="4" flexDir="column">
                  {isAuthenticated ? (
                    <>
                      <Flex flexDir="column" gap="1rem">
                        <Flex flexDir="column">
                          <Text fontSize="xs">Address</Text>
                          <Text fontSize="sm">
                            {user && user.get("ethAddress")}
                          </Text>
                        </Flex>
                        <Flex flexDir="column">
                          <Text fontSize="xs" pb="0.5rem">
                            Connected Chain
                            {/* {console.log(`chainId : ${chainId}`)} */}
                            {(chainId !== "0x38" && chainId !== "0x89") ? (
                              <Badge mx="0.5rem" px=".5rem" colorScheme={"red"}>
                                Wrong Chain
                              </Badge>
                            ) : (
                              ``
                            )}
                          </Text>
                          <Text>
                            {chainId === "0x38"
                              ? chain && `${chain.name}`
                              : chain && `${chain.name}`}
                          </Text>
                          {chainId !== "0x38" && (
                            <>
                              <Button
                                marginLeft="0px !important"
                                border="1px solid #4C5199"
                                gap=".5rem"
                                px="2rem"
                                py="1.5rem"
                                justifyContent="space-between"
                                onClick={() => switchChain("0x38")}
                              >
                                Switch to BSC Mainnet
                              </Button>
                            </>
                          )}
                          {chainId !== "0x89" && (
                            <>
                              <Button
                                marginLeft="0px !important"
                                border="1px solid #4C5199"
                                gap=".5rem"
                                px="2rem"
                                py="1.5rem"
                                justifyContent="space-between"
                                onClick={() => switchChain("0x89")}
                              >
                                Switch to Polygon Mainnet
                              </Button>
                            </>
                          )}
                        </Flex>
                      </Flex>
                      <Button
                        marginLeft="0px !important"
                        border="1px solid #4C5199"
                        gap=".5rem"
                        px="2rem"
                        py="1.5rem"
                        justifyContent="space-between"
                        onClick={() => handleAuth("logout")}
                      >
                        <Flex gap=".5rem" align="center">
                          Disconnect
                        </Flex>
                      </Button>
                    </>
                  ) : !isAuthenticating ? (
                    <>
                      <Button
                        border="1px solid #4C5199"
                        px="2rem"
                        py="1.5rem"
                        justifyContent="space-between"
                        onClick={handleAuth}
                        disabled={isAuthenticated || isAuthenticating}
                      >
                        <Flex gap=".5rem" align="center">
                          <img src={walletMM} alt="" width="25px" />
                          Metamask
                        </Flex>
                        <Badge colorScheme="green">Popular</Badge>
                      </Button>
                      <Button
                        marginLeft="0px !important"
                        border="1px solid #4C5199"
                        gap=".5rem"
                        px="2rem"
                        py="1.5rem"
                        justifyContent="space-between"
                        onClick={() => handleAuth("walletconnect")}
                        disabled={isAuthenticated || isAuthenticating}
                      >
                        <Flex gap=".5rem" align="center">
                          <img src={walletWC} alt="" width="25px" />
                          Wallet Connect
                        </Flex>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        marginLeft="0px !important"
                        border="1px solid #4C5199"
                        gap=".5rem"
                        px="2rem"
                        py="1.5rem"
                        justifyContent="space-between"
                        disabled={isAuthenticating}
                      >
                        <Flex gap=".5rem" align="center">
                          <Spinner />
                          Wait...
                        </Flex>
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              </Flex>
              <Spacer />
              <Button
                onClick={onClose}
                gap=".3rem"
                border="1px solid #ff6161"
                bg="transparent"
              >
                <img src={CloseIcon} alt="" width="25px" />
                Close
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ConnectWalletDrawer;
