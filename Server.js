// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: "bookstore_secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Sample Book Data (Preloaded)
const books = [
  { ISBN: "12345", title: "The Adventures of Tom Sawyer", author: "Sai", reviews: [{ username: "Bhargav", review: "Great book!" }] },
  { ISBN: "67890", title: "The Adventures of Huckleberry Finn", author: "Bhargav", reviews: [{ username: "Bhargav", review: "Great book!" }] },
  { ISBN: "11121", title: "The Great Gatsby", author: "F. Scott Fitzgerald", reviews: [{ username: "Bhargav", review: "Great book!" }] },
  { ISBN: "31415", title: "To Kill a Mockingbird", author: "Harper Lee", reviews: [{ username: "Bhargav", review: "Great book!" }] },
  { ISBN: "27182", title: "1984", author: "George Orwell", reviews: [{ username: "Bhargav", review: "Great book!" }] },
  { ISBN: "16180", title: "Pride and Prejudice", author: "Jane Austen", reviews: [{ username: "Sai", review: "Great book!" }] },
  { ISBN: "11223", title: "The Catcher in the Rye", author: "J.D. Salinger", reviews: [{ username: "Sai", review: "Great book!" }] },
  { ISBN: "14159", title: "Moby-Dick", author: "Herman Melville", reviews: [{ username: "Sai", review: "Great book!" }] },
  { ISBN: "20202", title: "War and Peace", author: "Leo Tolstoy", reviews: [{ username: "Sai", review: "Great book!" }] },
  { ISBN: "30303", title: "The Hobbit", author: "J.R.R. Tolkien", reviews: [{ username: "Sai", review: "Great book!" }] },
];

// Utility Functions
const doesUserExist = (username) => users.some((user) => user.username === username);
const isAuthenticated = (username, password) =>
  users.some((user) => user.username === username && user.password === password);

let users = []; // In-memory user storage

// Middleware for Authentication
const authenticateUser = (req, res, next) => {
  if (req.session.authorization) {
    const token = req.session.authorization["accessToken"];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
};

// **Task 1: Get all books (Async Callback)**
app.get("/books", async (req, res) => {
  setTimeout(() => {
    res.json(books);
  }, 1000);
});

// **Task 2: Get book by ISBN (Using Promises)**
app.get("/books/isbn/:isbn", (req, res) => {
  new Promise((resolve, reject) => {
    const book = books.find((b) => b.ISBN === req.params.isbn);
    if (book) resolve(book);
    else reject("Book not found");
  })
    .then((book) => res.json(book))
    .catch((error) => res.status(404).json({ message: error }));
});

// **Task 3: Get books by Author (Using Async/Await)**
app.get("/books/author/:author", async (req, res) => {
  const result = books.filter((b) => b.author.toLowerCase().includes(req.params.author.toLowerCase()));
  if (result.length > 0) res.json(result);
  else res.status(404).json({ message: "No books found for this author" });
});

// **Task 4: Get books by Title**
app.get("/books/title/:title", async (req, res) => {
  const result = books.filter((b) => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
  if (result.length > 0) res.json(result);
  else res.status(404).json({ message: "No books found with this title" });
});

// **Task 5: Get Book Reviews**
app.get("/books/reviews/:isbn", async (req, res) => {
  const book = books.find((b) => b.ISBN === req.params.isbn);
  if (book) res.json(book.reviews);
  else res.status(404).json({ message: "Book not found" });
});

// **Task 6: Register a User**
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (doesUserExist(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// **Task 7: Login User**
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isAuthenticated(username, password))
    return res.status(403).json({ message: "Invalid username or password" });

  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  req.session.authorization = { accessToken, username };
  res.status(200).json({ message: "Login successful!" });
});

// **Task 8: Dynamic Search for Books**
app.get("/books/search", (req, res) => {
  const { title, author, isbn } = req.query;

  let filteredBooks = books;

  if (title) {
    filteredBooks = filteredBooks.filter((b) => b.title.toLowerCase().includes(title.toLowerCase()));
  }

  if (author) {
    filteredBooks = filteredBooks.filter((b) => b.author.toLowerCase().includes(author.toLowerCase()));
  }

  if (isbn) {
    filteredBooks = filteredBooks.filter((b) => b.ISBN.includes(isbn));
  }

  if (filteredBooks.length > 0) {
    res.json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found matching your search criteria" });
  }
});

// Start the Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
