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
// req.body: username and password.
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (username === "mark" && password === "abc") {
    const user = {
      id: 1,
      username: "Mark",
      email: "abc@gmail.com",
    };
    jwt.sign({ user }, secret_key, { expiresIn: "500s" }, (error, token) => {
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
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/create", verifyToken, async (req, res) => {
  const data = new Product(req.body);
  try {
    const result = await data.save();
    res.status(201).json({
      message: "Post operation successful",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// req.params: _id (object id from mongodb) to update.
app.put("/update/:_id", verifyToken, async (req, res) => {
  // perform PUT operation.
  const data = await Product.updateOne(
    {
      _id: req.params,
    },
    { $set: { price: 350 } } // update new price.
  );
  res.send(data);
  res.json({ message: "Put operation successful" });
});

// req.params: _id (object id from mongodb) to delete.
app.delete("/delete/:_id", verifyToken, async (req, res) => {
  const data = await Product.deleteOne(req.params);
  res.send(data);
  // res.json({ message: "Delete operation successful" });
});

// listening on port 5000.
app.listen(5000, () => {
  console.log("Listening on port 5000.");
});
