Online Bookstore Management Project

Project Overview
This project is a Node.js-based backend server with an SQL database to manage an online bookstore. It includes a RESTful API to handle operations for books, customers, and orders and a basic frontend for interacting with the API.

Features
-CRUD Operations for Books: View, add, update, and delete books in the inventory.
-Customer Registration: Register new customers with name and email.
-Order Placement: Place orders, check stock, and update inventory.
-Error Handling: Displays user-friendly error messages on failures.
-Frontend Pages: Simple HTML pages to interact with the API.

Technologies Used
-Node.js for the server
-Express for API handling
-MySQL for the database (can be replaced with PostgreSQL)
-HTML, CSS, and JavaScript for the frontend
-Fetch API for asynchronous data retrieval

Setup Instructions
Prerequisites
-Node.js (v14 or higher)
-MySQL (or PostgreSQL) database

Step 1: Clone the Repository
git clone <repository-url>
cd mid-term

Step 2: Install Dependencies
npm install

Step 3: Set Up the Database

1. Create a Database in MySQL or PostgreSQL named bookstore or a name of your choice.
2. Run the SQL Script to create tables.

Step 4: Configure Environment Variables
Create a .env file in the root directory with the following content. Update the database credentials according to your setup:
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=bookstore
PORT=3000

Step 5: Start the Server
node server.js

API Endpoints
Books
GET /books - Retrieve all books
GET /books/:id - Retrieve a specific book by ID
POST /books - Add a new book
PUT /books/:id - Update a book by ID
DELETE /books/:id - Delete a book by ID

Customers
POST /customers - Register a new customer

Orders
POST /orders - Place a new order

Frontend Pages
-Books Inventory Page (books.html): Displays all books, allows adding, updating, and deleting books.
-Customer Registration Page (register.html): Form for registering a new customer.
-Order Page (order.html): Allows placing orders by selecting customers, books, and quantities.
-Each HTML page includes a navigation bar to switch between pages.

Access the Frontend
Open a web browser and go to:

    - Books Inventory: http://localhost:3000/books.html
    - Register Customer: http://localhost:3000/register.html
    - Place an Order: http://localhost:3000/order.html
