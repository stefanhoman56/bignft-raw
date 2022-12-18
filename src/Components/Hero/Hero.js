import React from "react";
import Footer from "../Footer/Footer";
import Card from "./Card";
import "./Hero.css";

function Hero() {
  return (
    <section className="main">
      <div className="container justify-content-center align-items-center">
        <Card />
      </div>
<div className="mobres-foot"></div>
      <Footer/>
    </section>
  );
}

export default Hero;
