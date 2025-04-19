const express = require("express");
const {
  register,
  confirmEmail,
  //resendConfirmationMail,
  login,
} = require("./authController");

const router = express.Router();

router.post("/register", register);
router.get("/confirmEmail/:token", confirmEmail);
//router.post("/resendConfirmationMail", resendConfirmationMail);
router.post("/login", login);
module.exports = router;
