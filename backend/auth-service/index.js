require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const globalErrorHandler = require("./errorController");

const app = express();
const PORT = process.env.SERVICE_PORT || 3000;
console.log("Auth SERVICE_PORT:", process.env.SERVICE_PORT);

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use("/api/auth", routes);
app.use(globalErrorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Auth service running on http://0.0.0.0:${PORT}`);
});
