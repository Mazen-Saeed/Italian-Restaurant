const jwt = require("jsonwebtoken");

const privateKey = process.env.JWT_PRIVATE_KEY;

exports.generateToken = (userId, secret, expiresIn) => {
  let token;
  if (secret)
    token = jwt.sign({ id: userId }, secret, {
      expiresIn,
    });
  else
    token = jwt.sign({ id: userId }, privateKey, {
      algorithm: "RS256",
      expiresIn,
    });
  return token;
};

exports.verifyToken = (token, secret) => {
  try {
    let decoded;
    decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    return null;
  }
};
