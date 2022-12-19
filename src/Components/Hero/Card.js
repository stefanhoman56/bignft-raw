import React, { useContext } from "react";
import { useNavigate } from "react-router";
import UserContext from "../../UserContext";
import CountDown from "../Common/CountDown";
import ProgressBar from "../Common/ProgressBar";

function Card() {
  const { connectWallet, account } = useContext(UserContext)
  const navigate = useNavigate();

  const gotoPresale = async () => {
    if (account) {
      navigate("/presale");
    } else {
      const success = await connectWallet();
      if (success) {
        navigate("/presale");
      } else {
      }
    }
  }

  return (
    <>
      <div className="card-box">
        <div className="card-content">
          <h1>BUY $BIGNFTS ON PRESALE</h1>
          <p className="symbol">1 $BIGNFTS = $1</p>
          <ProgressBar />
          <div className="d-flex justify-content-center gap-4 mt-10">
            <a style={{ cursor: "pointer" }} className="connect-btn" onClick={gotoPresale}>
              {account ? "Presale" : "Connect Wallet"}
            </a>
            <a href="/" className="how">
              {" "}
              HOW TO BUY
            </a>
          </div>
          <CountDown />

        </div>
      </div>
    </>
  );
}

export default Card;
