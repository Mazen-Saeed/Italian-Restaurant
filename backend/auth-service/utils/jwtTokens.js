const jwt = require("jsonwebtoken");

exports.generateToken = (userId, secret, expiresIn) => {
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
  return token;
};

exports.verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    return null;
  }
};
