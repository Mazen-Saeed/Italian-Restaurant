import React from "react";

import SubHeading from "../SubHeading/SubHeading";
import "./Newsletter.css";

const Newsletter = () => (
  <div className="app__newsletter">
    <div className="app__newsletter-heading">
      <SubHeading title="NewsLetter" />
      <h1 className="headtext__cormorant"> Subscribe to our Newsletter</h1>
      <p className="p__opensans">And Never miss Latest Updates!</p>
    </div>
    <div className="app__newsletter-input flex__center">
      <input type="email" placeholder="Enter Your Email"></input>
      <button className="custom__button">Subscribe</button>
    </div>
  </div>
);

export default Newsletter;
