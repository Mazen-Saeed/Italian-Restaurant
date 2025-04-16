const express = require("express");
const { sendEmail } = require("./emailController");

const router = express.Router();

router.post("/sendEmail", sendEmail);

module.exports = router;
