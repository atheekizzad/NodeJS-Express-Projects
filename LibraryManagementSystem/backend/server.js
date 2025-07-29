const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
app.use(express.json()); //because Express doesn't know how to parse JSON by default.
const path = require("path");
const dataPath = path.join(__dirname, "data", "books.json");
let books = [];
const fs = require("fs");
app.use(cors());

const loadBooks = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      const data = fs.writeFileSync(dataPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(dataPath, "utf-8");
    books = JSON.parse(data);
  } catch (err) {
    console.error("Error in reading books.json");
    books = [];
  }
};

loadBooks();

const savedBooks = () => {
  fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));
};

app.get("/books", (req, res) => {
  res.json(books); //It sends the books array back to the client as a JSON response.
});

app.post("/addedbooks", (req, res) => {
  const newBook = { id: uuidv4(), ...req.body };
  books.push(newBook);
  res.status(201).json({ message: "Book added", book: newBook });
  savedBooks();
});

app.delete("/books/:id", (req, res) => {
  const bookID = req.params.id;
  const index = books.findIndex((book) => book.id === bookID);
  if (index === -1) {
    return res.status(404).json({ message: "Book not Found" });
  }
  const deletedBook = books.splice(index, 1);
  res.status(200).json({ message: "Delete Sucessfully", book: deletedBook[0] });
  savedBooks();
});

app.put("/books/:editID", (req, res) => {
  const editID = req.params.editID;
  const index = books.findIndex((book) => book.id === editID);
  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  const updatedBook = { id: editID, ...req.body };
  books[index] = updatedBook;
  res.status(200).json({ message: "Succesfully updated", book: updatedBook });
  savedBooks();
});
app.listen(PORT, () => {
  console.log(`${PORT} running`);
});
