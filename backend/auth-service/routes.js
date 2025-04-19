const express = require("express");
const {
  register,
  confirmEmail,
  resendConfirmationMail,
} = require("./authController");

const router = express.Router();

router.post("/register", register);
router.get("/confirmEmail/:token", confirmEmail);
router.post("/resendConfirmationMail", resendConfirmationMail);
module.exports = router;
