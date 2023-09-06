const jwt = require("jsonwebtoken");

const secret_key = "abc@1234";

// Middleware to verify token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(req.token, secret_key, (error, authData) => {
      if (error) {
        res.send({ result: "Invalid Token" });
      } else {
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

module.exports = {
  verifyToken,
  secret_key,
};
