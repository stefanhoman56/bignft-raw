import {
  Menu,
  MenuButton,
  IconButton,
  Link,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import React from "react";
import ConnectWalletDrawer from "./ConnectWalletDrawer";
import { useMoralis } from "react-moralis";

function HamMenu({ login }) {
  const { isAuthenticated } = useMoralis();
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem>
          <Link href="https://battleinfinity.io/" isExternal>
            Litepaper <ExternalLinkIcon mx="2px" />
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="https://battleinfinity.io/" isExternal>
            How to Buy <ExternalLinkIcon mx="2px" />
          </Link>
        </MenuItem>

        {!isAuthenticated && <ConnectWalletDrawer />}
      </MenuList>
    </Menu>
  );
}

export default HamMenu;
