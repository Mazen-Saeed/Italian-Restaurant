require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const proxyRoutes = require("./proxyRoutes");

const app = express();
const PORT = process.env.SERVICE_PORT || 3000;

app.use(morgan("dev"));

// Remove the /api prefix here
app.use("", proxyRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Gateway is running on http://0.0.0.0:${PORT}`);
});
