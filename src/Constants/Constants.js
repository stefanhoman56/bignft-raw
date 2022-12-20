export const TEST_MODE = true
export const TESTNET_TOKEN_ADDRESS = "0x50116fF9Cb47ec32bC62DaDCfA3262335ed5b5f7"
export const MAINNET_TOKEN_ADDRESS = '0xdb40a4CEdB84BEce62A1d2F0be003b743d330FDa'
export const USDT_ADDRESS = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'
export const USDC_ADDRESS = '0x64544969ed7EBf5f083679233325356EbE738930'
export const BUSD_ADDRESS = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'
export const DAI_ADDRESS = '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867'
export const IBAT_ADDRESS = '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867'

// import WalletConnect from "@walletconnect/web3-provider"
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk"

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
}

export const TestnetChainID = 97
export const MainnetChainID = 56

export const BSCTestRPCUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545'
export const BSCMainRPCUrl = 'https://bsc-dataseed.binance.org'

export const TokenList = ["USDT", "USDC", "BUSD", "DAI", "IBAT"]

export const MainTokenAddress = TEST_MODE ? TESTNET_TOKEN_ADDRESS : MAINNET_TOKEN_ADDRESS
