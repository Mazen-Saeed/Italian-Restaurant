import React from "react";

import { FiShoppingCart } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import "./MenuCard.css";

function MenuCard({ mealName, mealImg, price }) {
  return (
    <div className="app__menucard">
      <img src={mealImg} alt="chicken" />
      <p className="p__cormorant app__menucard-mealname ">{mealName}</p>
      <div className="app__menucard-cart">
        <p className="p__opensans app__menucard-mealprice">Price: {price}$</p>
        <div className="app__menucard-icons">
          <BsThreeDots />
          <FiShoppingCart />
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
