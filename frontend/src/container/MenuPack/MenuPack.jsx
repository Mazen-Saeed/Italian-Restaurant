import { useState } from "react";
import React from "react";

import { MenuCard, SubHeading } from "../../components";
import { data } from "../../constants";

import "./MenuPack.css";

function MenuPack() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredMeals =
    activeFilter === "All"
      ? data.meals
      : data.meals.filter((meal) => meal.category === activeFilter);

  return (
    <div className="app__menupack app__bg flex__center section__padding">
      <h1 className="headtext__cormorant">The Menu</h1>
      <div className="app__menupack-container">
        <SubHeading title={"Choose your order !"} />
        <div className="app__menupack-buttons">
          {["All", "Breakfast", "Pizza", "Dessert", "Coffee"].map(
            (category) => (
              <button
                key={category}
                className={`custom__button ${
                  activeFilter === category ? "app__menupack-activebutton" : ""
                }`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            )
          )}
        </div>
        <div className="app__menupack-meals">
          {filteredMeals.map((meal) => (
            <MenuCard
              key={meal.id}
              mealImg={meal.img}
              mealName={meal.mealname}
              price={meal.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuPack;
