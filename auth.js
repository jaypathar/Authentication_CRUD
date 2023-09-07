const jwt = require("jsonwebtoken");

const secret_key = "abc@1234";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token has expired" });
        } else {
          return res.status(403).json({ error: "Token is not valid" });
        }
      }
      req.user = decoded.user; // Assuming your user information is stored in the 'user' field
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization header missing" });
  }
};

module.exports = {
  verifyToken,
  secret_key,
};
