import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Flex,
} from "@chakra-ui/react";
import iconDropDown from "../assets/dropdown.svg";
import { BSC_COINS_SUPPORTED } from "../COINS_SUPPORTED";
import { ETH_COINS_SUPPORTED } from "../COINS_SUPPORTED";
import { useEffect, useState } from "react";
import { useChain } from "react-moralis";

function CoinSelector({
  dropDownLabel,
  coin,
  setCoin,
  isAuthenticated,
  isLoadingERC20Balances,
  allBalances,
  nativeBalance,
  canBuyWithIbat,
}) {

  const { chainId } = useChain();

  const getSupportedCoins = () => {
    return chainId === "0x1" ? ETH_COINS_SUPPORTED : BSC_COINS_SUPPORTED;
  }

  const getCurrentCoin = () => {
    const filtered = getSupportedCoins().filter(
      (e) => e.symbol.toUpperCase() === coin
    );
    return filtered.length === 0 ? null : filtered[0];
  }

  const handleChange = (e) => {
    if (!e) return;
    let coin = e.currentTarget.value + "";
    coin = coin.toUpperCase();
    console.log(coin);
    setCoin(coin);
  };

  const [coinBalance, setCoinBalance] = useState(0);
  useEffect(() => {
    if (
      isAuthenticated &&
      !isLoadingERC20Balances &&
      allBalances &&
      coin !== "BNB" && coin !== "ETH"
    ) {
      let tempCoin = allBalances.filter((c) => {
        let symbol = c.symbol + "";
        return symbol.toUpperCase() === coin.toUpperCase();
      });
      tempCoin = tempCoin && tempCoin[0] ? tempCoin[0] : null;
      tempCoin = tempCoin
        ? tempCoin.balance / Math.pow(10, tempCoin.decimals)
        : 0;
      tempCoin = Number(tempCoin);
      tempCoin = Number(tempCoin).toFixed(3);
      setCoinBalance(tempCoin);
    } else {
      setCoinBalance(nativeBalance.formatted);
    }
  }, [
    coin,
    allBalances,
    isAuthenticated,
    isLoadingERC20Balances,
    nativeBalance.formatted,
  ]);

  return (
    <Flex alignItems="center" justifyContent={"space-between"}>
      <Menu bg="rgba(0, 2, 17, 0.3)">
        <MenuButton
          as={Button}
          borderRadius="lg"
          fontSize="xs"
          height="1.5rem"
          padding=".25rem 1rem"
          marginLeft="-0.5rem"
          width="max-content"
          textAlign="left"
          rightIcon={
            <img
              src={iconDropDown}
              alt="drop down icon"
              width="10px"
              style={{ marginLeft: ".75rem" }}
            />
          }
          bg="rgba(0, 2, 17, 0)"
          _hover={{ background: "rgba(0, 2, 17, 0.5)" }}
          _active={{ background: "rgba(0, 2, 17, 0.5)" }}
          _expanded={{ background: "rgba(0, 2, 17, 0.5)" }}
        >
          <Flex gap=".5rem" alignItems="center" justifyContent="space-between">
            {dropDownLabel}{" "}
            <Flex alignItems="center" gap=".25rem">
              <img
                src={
                  coin
                    ? (getCurrentCoin() && getCurrentCoin().imgSrc)
                    : ""
                }
                alt={`${coin} symbol`}
                style={{
                  borderRadius: "100%",
                  width: "16px",
                  display: "inline",
                }}
              />
              {coin}
            </Flex>
          </Flex>
        </MenuButton>
        <MenuList
          background="rgba(0, 2, 17, 0.8)"
          width="12rem"
          borderRadius="xl"
          backdropFilter="blur(10px)"
        >
          {getSupportedCoins().map((c) =>
            canBuyWithIbat ? (
              <MenuItem
                onClick={(e) => handleChange(e)}
                _hover={{ background: "rgba(0, 2, 17, 0.5)" }}
                _focus={{ fontWeight: "bold" }}
                value={c.symbol}
                key={c.symbol}
                gap=".5rem"
              >
                <img
                  src={c.imgSrc}
                  alt={`${c.name} token symbol`}
                  style={{ borderRadius: "100%", width: "24px" }}
                />
                <Text>{c.symbol.toUpperCase()}</Text>
                <Flex direction="column">
                  <Text style={{ pointerEvents: "none" }} fontSize="0.65rem">
                    {c.name}
                  </Text>
                </Flex>
              </MenuItem>
            ) : (
              c.symbol.toUpperCase() !== "IBAT" && (
                <MenuItem
                  onClick={(e) => handleChange(e)}
                  _hover={{ background: "rgba(0, 2, 17, 0.5)" }}
                  _focus={{ fontWeight: "bold" }}
                  value={c.symbol}
                  key={c.symbol}
                  gap=".5rem"
                >
                  <img
                    src={c.imgSrc}
                    alt={`${c.name} token symbol`}
                    style={{ borderRadius: "100%", width: "24px" }}
                  />
                  <Text>{c.symbol.toUpperCase()}</Text>
                  <Flex direction="column">
                    <Text style={{ pointerEvents: "none" }} fontSize="0.65rem">
                      {c.name}
                    </Text>
                  </Flex>
                </MenuItem>
              )
            )
          )}
        </MenuList>
      </Menu>
      <Text fontSize="xs">
        {isAuthenticated &&
          `Balance: ${isNaN(parseFloat(coinBalance))
            ? "loading..."
            : parseFloat(coinBalance)
          } ${coin !== "BNB" ? coin : "BNB"}`}
      </Text>
    </Flex>
  );
}

export default CoinSelector;
