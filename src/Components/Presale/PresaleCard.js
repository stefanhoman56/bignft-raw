import React, { useContext, useEffect, useRef, useState } from "react";
import "./Presale.css";
import Down from '../../assets/down.png'
import CountDown from "../Common/CountDown";
import ProgressBar from "../Common/ProgressBar";
import UserContext from "../../UserContext";
import { ethers } from "ethers";
import { TokenList } from "../../Constants/Constants";

function PresaleCard() {
  const { provider, contracts, account } = useContext(UserContext)
  const [balances, setBalances] = useState({ BNB: 0 })
  const tokenElement = useRef()
  const nftAmountElement = useRef()

  useEffect(() => {
    if (!account) {
      setBalances({
        BNB: 0,
        USDT: 0,
        USDC: 0,
        BUSD: 0,
        DAI: 0,
        IBAT: 0,
      })
    } else {
      const getBNBBalance = async () => {
        const balance = await provider.getBalance(account)
        return ethers.utils.formatEther(balance)
      }

      const getTokenBalances = async (token) => {
        console.log(token, " getting balance")
        const balance = await contracts[token].balanceOf(account)
        const decimals = (await contracts[token].decimals()).toNumber()
        console.log("success")
        return balance.div("1" + "0".repeat(decimals)).toNumber()
      }

      const getAllBalances = async () => {
        const balances = { BNB: await getBNBBalance() }
        for (const token of TokenList) {
          balances[token] = await getTokenBalances(token)
        }
        setBalances(balances)
      }

      getAllBalances()
    }

  }, [account])

  const buyNFT = async (e) => {
    e.preventDefault();

    if (!account) {
      return
    }

    const token = tokenElement.current.value
    const nftAmount = nftAmountElement.current.value

    try {
      let transaction = null;
      if (token == "BNB") {
        const bnbAmount = await contracts.Main.getBNBAmount(nftAmount)
        console.log(bnbAmount)
        transaction = await contracts.Main.buyWithBNB(nftAmount, { value: bnbAmount })
      } else if (token == "IBAT") {
        const ibatAmount = await contracts.Main.getIBATAmount(nftAmount)
        await contracts.IBAT.approve(contracts.Main.address, ibatAmount)
        transaction = await contracts.Main.buyWithIBAT(nftAmount)
      } else {
        const tokenIndex = TokenList.indexOf(token)
        const tokenAmount = await contracts.Main.getTokenAmount(nftAmount, tokenIndex)
        await contracts[token].approve(contracts.Main.address, tokenAmount)
        transaction = await contracts.Main.buyWithUSD(nftAmount, tokenIndex)
      }
      const tx_result = await transaction.wait()
      alert(`Successfully bought domain. TX: ${tx_result.transactionHash}`)
      console.log("transaction", tx_result.transactionHash)
    } catch (error) {
      alert("Error occured during transaction. Please check the browser console.\n" + error.reason.data.message)
      console.error("Transaction Error:", error.reason)
    }
  }

  return (
    <>
      <div className="card-box-2">
        <div className="card-content">
          <h1>BUY $BIGNFTS ON PRESALE</h1>
          <p className="symbol">1 $BIGNFTS = $1</p>
          <ProgressBar />
          <CountDown />
          <div className="club">
            <div className="token-box">
              <h2>Select Payment Token</h2>
              <div className="">
                <form>
                  <div className="select-box">
                    <p>
                      IBAT <span className="red">10% discount</span>
                    </p>
                    <select id="cars" name="cars" ref={tokenElement}>
                      <option value="BNB">Balance: {balances.BNB} BNB</option>
                      {TokenList.map(((token, index) => (
                        <option key={index} value={token}>Balance: {balances[token]} {token}</option>
                      )))}
                    </select>
                  </div>
                  <div className="text-center">
                    <img src={Down} alt="" className="down" />

                  </div>
                  <div className="d-flex sec-num">
                    <input ref={nftAmountElement}
                      type="number"
                      className="input-num"
                      placeholder="100,00,0"
                      name="number"
                    />
                    <p className="num-p">$BIGNFT</p>
                  </div>


                  <div className="btn-modal">
                    <button
                      type="button"
                      className="buy-btn-token"
                      onClick={buyNFT}
                    >
                      BUY NOW
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="token-box-2">
              <h2>Token Info</h2>
              <div className="sub-box">
                <p>Total Supply</p>
                <p className="sub-b-p">100,000,000 </p>
                <br />
                <p>Token Contract Address</p>
                <p className="sub-b-p">0x19cd9b8e42d4ef62c3...</p>

                <br />
                <p>Tokens Decimals</p>
                <p className="sub-b-p">2</p>
                <br />
                <p>$BIGNFTs Balance</p>
                <p className="sub-b-p">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PresaleCard;
