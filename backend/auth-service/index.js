require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const globalErrorHandler = require("./errorController");

const app = express();
const PORT = process.env.SERVICE_PORT;

app.use(express.json());
app.use("/api/auth", routes);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
