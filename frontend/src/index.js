import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

// auth stuff
import { Provider } from "react-redux";
import store from "./auth/store.js";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
