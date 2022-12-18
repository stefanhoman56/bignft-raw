import React from "react";
import Clock from "../../assets/timer.png";
import "./Presale.css";
import Down from '../../assets/down.png'

function PresaleCard() {
  return (
    <>
      <div className="card-box-2">
        <div className="card-content">
          <h1>BUY $BIGNFTS ON PRESALE</h1>
          <p className="symbol">1 $BIGNFTS = $1</p>

          <div className="bar">
            <div className="sub-bar"></div>
          </div>
          <p className="progress-1">
            Progress <span className="pr-num">48%</span>(23,750,345/50,000,000)
          </p>

          <div className="d-flex justify-content-center mt-10">
            <img src={Clock} alt="" className="timer" />
            <p className="count-down">
              <span className="num">10</span> DAYS,{" "}
              <span className="num">15</span> HOURS,{" "}
              <span className="num">45</span> MINUTES,{" "}
              <span className="num">10</span> SECONDS remaining
            </p>
          </div>
          <div className="club">
            <div className="token-box">
              <h2>Select Payment Token</h2>
              <div className="">
                <form>
                  <div className="select-box">
                    <p>
                      IBAT <span className="red">10% discount</span>
                    </p>
                    <select id="cars" name="cars">
                      <option value="volvo">Balance: 18,000 $IBAT</option>
                    
                    </select>
                  </div>
                  <div className="text-center">
                    <img src={Down} alt="" className="down"/>

                  </div>
                  <div className="d-flex sec-num">
                    <input
                      type="number"
                      className="input-num"
                      placeholder="100,00,0"
                      name="number"
                    />
                    <p className="num-p">$BIGNFT</p>
                  </div>
                  

                  <div className="btn-modal">
                    <button
                      type="submit"
                      className="buy-btn-token"
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
