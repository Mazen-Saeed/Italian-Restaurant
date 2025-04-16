require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const proxyRoutes = require("./proxyRoutes");

const app = express();
const PORT = process.env.SERVICE_PORT;

app.use(morgan("dev"));
app.use("/api/", proxyRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
