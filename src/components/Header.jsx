import logo from "../assets/logo.png";
import { Flex, Link, useMediaQuery } from "@chakra-ui/react";
import "../styles/Header.scss";
import ConnectWalletDrawer from "./ConnectWalletDrawer";
import { useMoralis } from "react-moralis";
import HamMenu from "./HamMenu";
import { ExternalLinkIcon } from "@chakra-ui/icons";

function Header({ login }) {
  const { isAuthenticated } = useMoralis();
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  return (
    <>
      <header className="header" style={{ background: "#140421" }}>
        <Flex
          width={"full"}
          justifyContent="space-between"
          alignItems={"center"}
          margin="auto"
          maxWidth={"1400px"}
          fontFamily="Russo One"
        >
          <img
            src={logo}
            className="header__logo"
            alt="logo"
            style={{ width: "10rem" }}
          />
          {!isLargerThan500 ? (
            <Flex
              alignItems={"center"}
              textTransform="uppercase"
              fontWeight={"semibold"}
              fontSize=".85rem"
              gap={!isLargerThan500 ? ".75rem" : "2rem"}
            >
              {isAuthenticated && <ConnectWalletDrawer />}
              <HamMenu login={login} />
            </Flex>
          ) : (
            <Flex
              gap="2rem"
              alignItems={"center"}
              textTransform="uppercase"
              fontWeight={"semibold"}
              fontSize=".85rem"
            >
              <Link href="https://battleinfinity.io/" isExternal>
                Litepaper <ExternalLinkIcon mx="2px" />
              </Link>
              <Link href="https://battlesquad.io/how-to-buy-bats/" isExternal>
                How to Buy <ExternalLinkIcon mx="2px" />
              </Link>
              <ConnectWalletDrawer login={login} />
            </Flex>
          )}
        </Flex>
      </header>
    </>
  );
}

export default Header;
