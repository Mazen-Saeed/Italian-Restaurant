const express = require("express");
const {
  protect,
  addAddressToUser,
  getMyData,
  getMyPoints,
} = require("./userController");
const router = express.Router();

router.get("/me", protect, getMyData);
router.get("/me/points", protect, getMyPoints);
//router.get("/me/addresses", protect, getMyAddresses);
router.post("/addAddress", protect, addAddressToUser);
router.patch("/changePassword", protect, addAddressToUser);
router.patch("/changePhone", protect, addAddressToUser);

module.exports = router;
