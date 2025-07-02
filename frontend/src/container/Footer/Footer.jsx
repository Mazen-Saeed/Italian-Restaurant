import React from "react";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

import { FooterOverlay, Newsletter } from "../../components";
import { images } from "../../constants";
import "./Footer.css";

const Footer = () => (
  <div className="app__footer section__padding">
    <FooterOverlay />
    <Newsletter />

    <div className="app__footer-links">
      <div className="app__footer-links_contact">
        <h1 className="app__footer-headtext">Contact Us</h1>
        <p className="p__opensans">adders</p>
        <p className="p__opensans">phone number</p>
        <p className="p__opensans">adders</p>
      </div>
      <div className="app__footer-links_logo">
        <img src={images.italiano} alt="logo" />
        <p className="opensans">The Best way</p>
        <img
          src={images.spoon}
          alt="spoon"
          className="spoon__img"
          style={{ marginTop: "15px" }}
        />
        <div className="app__footer-links_icons">
          <FiFacebook />
          <FiTwitter />
          <FiInstagram />
        </div>
      </div>
      <div className="app__footer-links_work">
        <h1 className="app__footer-headtext">Working Hours</h1>
        <p className="p__opensans">Mondu-fridau</p>
        <p className="p__opensans">10:0am - 9:00 pm</p>
        <p className="p__opensans">adders</p>
      </div>
    </div>
    <div className="footer_copyright">
      <p className="p__opensans">2021 Italiano</p>
    </div>
  </div>
);

export default Footer;
