import coinIBAT from "./assets/coinIBAT.svg";
import coinBNB from "./assets/coinBNB.svg";
import coinBUSD from "./assets/coinBUSD.png";
import coinUSDT from "./assets/coinUSDT.png";
import coinUSDC from "./assets/coinUSDC.png";
import coinDAI from "./assets/coinDAI.png";
import coinMATIC from "./assets/coinMATIC.png";

export const BSC_COINS_SUPPORTED = [
  {
    symbol: "IBAT",
    name: "Battle Infinity",
    bscContractAddress: "0x19cd9B8e42d4EF62c3EA124110D5Cfd283CEaC43",
    imgSrc: coinIBAT,
    decimal: 9,
    ABI_allowance: [
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    ABI_approve: [
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
  {
    symbol: "BNB",
    name: "Binance Smart Chain Native Token",
    bscContractAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    imgSrc: coinBNB,
    decimal: 18,
  },
  {
    symbol: "BUSD",
    name: "BUSD Token",
    bscContractAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    imgSrc: coinBUSD,
    decimal: 18,
    ABI_allowance: [
      {
        constant: true,
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    ABI_approve: [
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    bscContractAddress: "0x55d398326f99059fF775485246999027B3197955",
    imgSrc: coinUSDT,
    decimal: 6,
    ABI_allowance: [
      {
        constant: true,
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    ABI_approve: [
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
  {
    symbol: "USDC",
    name: "Binance-Peg USD Coin",
    bscContractAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    imgSrc: coinUSDC,
    decimal: 18,
    ABI_allowance: [
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    ABI_approve: [
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
  {
    symbol: "DAI",
    name: "Binance-Peg Dai Token",
    bscContractAddress: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    imgSrc: coinDAI,
    decimal: 18,
    ABI_allowance: [
      {
        constant: true,
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    ABI_approve: [
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  }
];


export const POLYGON_COINS_SUPPORTED = [
  {
    symbol: "MATIC",
    name: "Polygon Native Token",
    bscContractAddress: "0xcd3a509cfa7878d5d16315d609cb301b577c0182",
    imgSrc: coinMATIC,
    decimal: 18,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    bscContractAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    imgSrc: coinUSDT,
    decimal: 6,
    ABI_allowance: [
      {
        constant: true,
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    ABI_approve: [
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
];
