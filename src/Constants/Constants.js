// import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export const providerOptions = {
    binancechainwallet: {
        package: true,
    },
    // walletconnect: {
    //     package: WalletConnect, // required
    //     options: {
    //         infuraId: process.env.INFURA_ID // required
    //     }
    // },
    // coinbasewallet: {
    //     package: CoinbaseWalletSDK, // Required
    //     options: {
    //         appName: "Coinbase", // Required
    //         infuraId: process.env.INFURA_ID, // Required
    //     }
    // }
};

export const ContractAddress = "0x50116fF9Cb47ec32bC62DaDCfA3262335ed5b5f7";

export const TestnetChainID = 97;
export const MainnetChainID = 56;

export const BSCTestRPCUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545';