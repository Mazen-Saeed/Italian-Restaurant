const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(
  path.join(__dirname, "..", "public.key"),
  "utf8"
);

exports.verifyToken = (token) => {
  try {
    let decoded;
    decoded = jwt.verify(token, publicKey);
    return decoded;
  } catch (err) {
    return null;
  }
};
