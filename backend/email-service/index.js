require("dotenv").config();
const express = require("express");
const globalErrorHandler = require("./errorController");

const routes = require("./routes");

const app = express();
const PORT = process.env.SERVICE_PORT;

app.use(express.json());
app.use("/api/email", routes);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});
