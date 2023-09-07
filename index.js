const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { verifyToken, secret_key } = require("./auth");
const { mongoose } = require("./database");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a Mongoose schema for products.
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

// Create a Mongoose model for products.
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

// CRUD APIs with token verification
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
  const { name, price, description } = req.body;
  console.log(name, price, description);
  const product = new Product({ name, price, description });
  product
    .save()
    .then(() => {
      res.status(201).json({ message: "Product created successfully" });
    })
    .catch((error) => {
      console.error("Error creating product", error);
      res.status(400).json({ message: "Bad request" });
    });
});

app.put("/update/:id", verifyToken, (req, res) => {
  // Perform put operation
  res.json({ message: "Put operation successful" });
});

app.delete("/delete/:id", verifyToken, (req, res) => {
  // Perform delete operation
  res.json({ message: "Delete operation successful" });
});

// listening on port 5000.
app.listen(5000, () => {
  console.log("Listening on port 5000.");
});
