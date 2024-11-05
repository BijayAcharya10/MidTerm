require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

// --- Books Endpoints ---

// GET /books - Retrieve all books
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM Books";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /books/:id - Retrieve a book by ID
app.get("/books/:id", (req, res) => {
  const sql = "SELECT * FROM Books WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Book not found" });
    res.json(results[0]);
  });
});

// POST /books - Add a new book
app.post("/books", (req, res) => {
  const { title, author, price, stock } = req.body;
  const sql =
    "INSERT INTO Books (title, author, price, stock) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, author, price, stock], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, title, author, price, stock });
  });
});

// PUT /books/:id - Update a book
app.put("/books/:id", (req, res) => {
  const { title, author, price, stock } = req.body;
  const sql =
    "UPDATE Books SET title = ?, author = ?, price = ?, stock = ? WHERE id = ?";
  db.query(sql, [title, author, price, stock, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Book not found" });
    res.json({ id: req.params.id, title, author, price, stock });
  });
});

// DELETE /books/:id - Delete a book
app.delete("/books/:id", (req, res) => {
  const sql = "DELETE FROM Books WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  });
});

// --- Customers Endpoint ---

// POST /customers - Add a new customer
app.post("/customers", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO Customers (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name, email });
  });
});

// GET /customers - Retrieve all books
app.get("/customers", (req, res) => {
  const sql = "SELECT * FROM Customers";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- Orders Endpoint ---

// POST /orders - Place an order
app.post("/orders", (req, res) => {
  const { customer_id, book_id, quantity } = req.body;

  // Check if enough stock is available
  const stockCheckSql = "SELECT stock FROM Books WHERE id = ?";
  db.query(stockCheckSql, [book_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Book not found" });

    const availableStock = results[0].stock;
    if (availableStock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Proceed with order if stock is available
    const orderSql =
      "INSERT INTO Orders (customer_id, book_id, quantity, order_date) VALUES (?, ?, ?, CURDATE())";
    db.query(orderSql, [customer_id, book_id, quantity], (err, orderResult) => {
      if (err) return res.status(500).json({ error: err.message });

      // Update stock after order
      const updateStockSql = "UPDATE Books SET stock = stock - ? WHERE id = ?";
      db.query(updateStockSql, [quantity, book_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
          message: "Order placed successfully",
          orderId: orderResult.insertId,
        });
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static("public"));
