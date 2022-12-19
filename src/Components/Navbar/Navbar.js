import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import Logo from '../../assets/logo2.png'
import UserContext from "../../UserContext";



function Navbar() {
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  const { connectWallet, disconnectWallet, account } = useContext(UserContext)


  return (
    <>
      <nav className="container main-nav">
        <div className="logo">
          {" "}
          <div className="d-flex foot-logo">
            <NavLink to='/'>
              <img
                src={Logo}
                alt=""
                className=""
              />

            </NavLink>

          </div>
        </div>
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }
        >
          <ul>
            <li>
              <NavLink to="/" >Litepaper</NavLink>
            </li>



            <li>
              <NavLink to="/rewards" >How to buy</NavLink>
            </li>
            <li>
              {account ? (
                <NavLink onClick={disconnectWallet}>Disconnect Wallet</NavLink>
              ) : (
                <NavLink onClick={connectWallet}>Connect Wallet</NavLink>
              )}
            </li>
          </ul>
        </div>
        {/* hamburget menu start  */}
        <div className="hamburger-menu">
          <a href="#home" onClick={() => setShowMediaIcons(!showMediaIcons)}>
            <GiHamburgerMenu />
          </a>
        </div>
      </nav>

    </>
  );
}

export default Navbar;
