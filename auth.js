// importing library.
const jwt = require("jsonwebtoken");

// define a secret key for signing and verifying tokens.
const secret_key = "abc@1234";

// middleware to verify token
const verifyToken = (req, res, next) => {
  // extract the 'Authorization' header from the request.
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // split the 'Authorization' header to obtain the token part.
    const token = authHeader.split(" ")[1];
    // verify the token using the secret key
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // return a 401 status with an error message if the token has expired.
          return res.status(401).json({ error: "Token has expired" });
        } else {
          // return a 403 status with an error message if the token is not valid.
          return res.status(403).json({ error: "Token is not valid" });
        }
      }
      // if the token is valid, decode it and attach the user information to the request.
      req.user = decoded.user; // assuming your user information is stored in the 'user' field
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization header missing" });
  }
};

// export the 'verifyToken' middleware and the 'secret_key'.
module.exports = {
  verifyToken,
  secret_key,
};
