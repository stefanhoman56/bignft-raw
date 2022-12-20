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
  const mainContract = contracts.main
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
        console.log(token)
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

    const salePrice = await mainContract.salePrice()
    try {
      let transaction = null;
      if (token == "BNB") {
        const bnbPrice = await mainContract.getBNBLatestPrice()
        transaction = await mainContract.buyWithBNB(nftAmount, { value: salePrice.mul(nftAmount).div(bnbPrice) })
      } else if (token == "IBAT") {
        const ibatPrice = await mainContract.getIBATLatestPrice()
        await contracts.IBAT.approve(mainContract.address, salePrice.mul(nftAmount).div(ibatPrice))
        transaction = await mainContract.buyWithIBAT(nftAmount)
      } else {
        await contracts[token].approve(mainContract.address, salePrice.mul(nftAmount))
        transaction = await mainContract.buyWithUSD(nftAmount, TokenList.indexOf(token))
      }
      const tx_result = await transaction.wait()
      alert(`Successfully bought domain. TX: ${tx_result.transactionHash}`)
      console.log("transaction", tx_result.transactionHash)
    } catch (error) {
      alert("Error occured during transaction. Please check the browser console.")
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
