const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { verifyToken, secret_key } = require("./auth");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(express.json());

// define the Swagger options and create the Swagger specification.
const swaggerOptions = {
  parameterOptions: {
    allowEditing: true, // allow editing of path parameters.
  },
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product API",
      version: "1.0.0",
      description: "API for managing products",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["index.js"],
};
// generate OpenAPI specification from JSDoc comments.
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// add the Swagger middleware to express app.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// login api to generate token.
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Generates a JWT token for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *             example:
 *               username: mark
 *               password: abc
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (username == "mark" && password == "abc") {
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
/**
 * @swagger
 * /read:
 *   get:
 *     summary: Retrieves data from the server
 *     description: Retrieves data from the server using a GET request
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get("/read", verifyToken, (req, res) => {
  // Perform get operation
  res.json({ message: "Get operation successful" });
});

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Creates new data on the server
 *     description: Creates new data on the server using a POST request
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/create", verifyToken, (req, res) => {
  // Perform post operation
  res.json({ message: "Post operation successful" });
});

/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Updates data on the server
 *     description: Updates data on the server using a PUT request
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the data to update
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.put("/update/:id", verifyToken, (req, res) => {
  // Perform put operation
  res.json({ message: "Put operation successful" });
});

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Deletes data from the server
 *     description: Deletes data from the server using a DELETE request
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the data to delete
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.delete("/delete/:id", verifyToken, (req, res) => {
  // Perform delete operation
  res.json({ message: "Delete operation successful" });
});

// listening on port 5000.
app.listen(5000, () => {
  console.log("Listening on port 5000.");
});
