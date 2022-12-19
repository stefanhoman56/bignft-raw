import React, { useContext, useEffect, useRef, useState } from "react";
import "./Presale.css";
import Down from '../../assets/down.png'
import CountDown from "../Common/CountDown";
import ProgressBar from "../Common/ProgressBar";
import UserContext from "../../UserContext";
import { ethers } from "ethers";
import BN from "bn.js";

function PresaleCard() {
  const { provider, contract, account } = useContext(UserContext)
  const [BNBBalance, setBNBBalance] = useState(0)
  const [USDTBalance, setUSDTBalance] = useState(0)
  const [IBATBalance, setIBATBalance] = useState(0)
  const currenyElement = useRef()
  const nftAmountElement = useRef()

  useEffect(() => {
    if (!account) {
      setBNBBalance(0)
      setUSDTBalance(0)
      setIBATBalance(0)
    } else {
      const getBNBBalance = async () => {
        const balance = await provider.getBalance(account)
        setBNBBalance(ethers.utils.formatEther(balance))
      }
      const getUSDTBalance = async () => {

      }
      const getIBATBalance = async () => {

      }
      getBNBBalance()
      getUSDTBalance()
      getIBATBalance()
    }

  }, [account])

  const buyNFT = async (e) => {
    e.preventDefault();

    if (!account) {
      return
    }

    const currency = currenyElement.current.value
    const nftAmount = nftAmountElement.current.value

    const salePrice = await contract.salePrice()
    // try {
    if (currency == "bnb") {
      const bnbPrice = await contract.getBNBLatestPrice()
      const transaction = await contract.buyWithBNB(nftAmount, { value: salePrice.mul(nftAmount).div(bnbPrice) })
      const tx_result = await transaction.wait()
      alert(`Successfully bought domain. TX: ${tx_result.transactionHash}`)
      console.log("transaction", tx_result.transactionHash)
    } else if (currency == "usdt") {
      // await contract.buyWithBNB(nftAmount, { value: salePrice.mul(new BN(nftAmount)) })
    } else {

    }
    // } catch (error) {
    //   console.log("error ", error.reason)
    // }
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
                    <select id="cars" name="cars" ref={currenyElement}>
                      <option value="bnb">Balance: {BNBBalance} BNB</option>
                      <option value="usdt">Balance: {USDTBalance} USDT</option>
                      <option value="ibat">Balance: {USDTBalance} IBAT</option>
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
