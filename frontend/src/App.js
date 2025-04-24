import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  AboutUs,
  Chef,
  FindUs,
  Footer,
  Gallery,
  Header,
  Intro,
  Laurels,
  SpecialMenu,
  Profile,
  MenuPack,
} from "./container";

import { Navbar } from "./components";
import "./App.css";

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Header />
            <AboutUs />
            <SpecialMenu />
            <Chef />
            <Intro />
            <Laurels />
            <Gallery />
            <FindUs />
            <Footer />
          </>
        }
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<MenuPack />} />
    </Routes>
  </Router>
);

export default App;
