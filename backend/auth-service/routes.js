const express = require("express");
const {
  register,
  confirmEmail,
  resendConfirmationMail,
  login,
  logout,
  forgetPassword,
  resetPassword,
} = require("./authController");

const router = express.Router();

router.post("/register", register);
router.get("/confirmEmail/:token", confirmEmail);
router.post("/resendConfirmationMail", resendConfirmationMail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgetPassword", forgetPassword);
router.get("/resetPassword/:token", resetPassword);
module.exports = router;
