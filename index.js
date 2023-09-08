// importing modules.
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { verifyToken, secret_key } = require("./auth");
const { mongoose } = require("./database");

// middleware to handle JSON and URL-encoded data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// define a Mongoose schema for products.
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
});

// create a Mongoose model for products.
const Product = mongoose.model("Product", productSchema);

// login api to generate token.
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (username === "mark" && password === "abc") {
    const user = {
      id: 1,
      username: "Mark",
      email: "abc@gmail.com",
    };
    jwt.sign({ user }, secret_key, { expiresIn: "7d" }, (error, token) => {
      res.json({ token });
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// CRUD APIs with token verification.
app.get("/read", verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/create", verifyToken, (req, res) => {
  // perform POST operation.
  res.json({
    message: "Post operation successful",
  });
});

app.put("/update/:id", verifyToken, (req, res) => {
  // perform PUT operation.
  res.json({ message: "Put operation successful" });
});

app.delete("/delete/:id", verifyToken, (req, res) => {
  // perform DELETE operation.
  res.json({ message: "Delete operation successful" });
});

// listening on port 5000.
app.listen(5000, () => {
  console.log("Listening on port 5000.");
});
