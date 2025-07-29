import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [state, setState] = useState("");
  const [books, setBooks] = useState([]);
  const [alert, setAlert] = useState("");
  const [editID, setEditID] = useState(null);

  const fetchbooks = async () => {
    try {
      const res = await fetch("http://localhost:3000/books");
      const data = await res.json(); // Parse the response body from JSON into a JavaScript object
      setBooks(data);
      setAlert("");
    } catch (err) {
      console.error(err);
      setAlert("Failed to Fetch books from backend");
    }
  };
  useEffect(() => {
    fetchbooks();
  }, []);

  const handleClick = async () => {
    if (!name || !author || !pages || !price || !state) {
      setAlert("Please fill all the field");
      return;
    }
    const newBook = { name, author, pages, price, state };
    try {
      const res = await fetch("http://localhost:3000/addedbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook), //you're telling the browser to convert your newBook
        // //object into a JSON-formatted string, because that's what the server expects when receiving data via HTTP.
      });
      const results = await res.json();
      console.log(results);
      if (res.ok) {
        console.log(results.message);
        console.log(results.book);
        fetchbooks();
        setName("");
        setAuthor("");
        setPages("");
        setPrice("");
        setState("");
        setAlert("");
      } else {
        console.error("failed to add book");
        setAlert("Something off with response");
      }
    } catch (err) {
      console.error(err);
      setAlert("failed to add books");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data.message);
      if (res.ok) {
        fetchbooks();
        setAlert("");
      } else {
        console.error("failed to delete");
        setAlert("Something of with delete request");
      }
    } catch (err) {
      console.error(err);
      setAlert("Failed to delete book");
    }
  };
  const handleEdit = (book, id) => {
    setName(book.name);
    setAuthor(book.author);
    setPages(book.pages);
    setPrice(book.price);
    setState(book.state);
    setEditID(id);
  };
  const handleUpdate = async (editID) => {
    if (!name || !author || !pages || !price || !state) {
      setAlert("Please fill all the field");
      return;
    }
    const updatedbook = { name, author, pages, price, state };
    try {
      const res = await fetch(`http://localhost:3000/books/${editID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedbook),
      });
      const results = await res.json();
      console.log(results.message);
      if (res.ok) {
        fetchbooks();
        setName("");
        setAuthor("");
        setPages("");
        setPrice("");
        setState("");
        setAlert("");
        setEditID(null);
      } else {
        setAlert("something off with updating");
      }
    } catch (err) {
      console.error(err);
      setAlert("failed to Put/ Edit the details");
    }
  };
  return (
    <div className="App">
      <h2>
        <span>📚 Library</span> Book Management System with{" "}
        <span>⚛️ React</span> + <span>🟢 Node.js</span> + Express
      </h2>
      <table>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Book Author</th>
            <th>Book Pages</th>
            <th>Book Price</th>
            <th>Book Availability</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            return (
              <tr key={book.id}>
                <td>{book.name}</td>
                <td>{book.author}</td>
                <td>{book.pages}</td>
                <td>{book.price}</td>
                <td>{book.state}</td>
                <td>
                  <button onClick={() => handleDelete(book.id)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => handleEdit(book, book.id)}>
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2>{editID !== null ? "Edit" : "Add Book"}</h2>
      <div className="input-group">
        <input
          className="input-field"
          type="text"
          placeholder="Enter the Book Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Enter the Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="Enter the Pages"
          className="input-small"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
        />
        <input
          type="text"
          className="input-small"
          placeholder="Enter the Book price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div className="input-radio-group">
          <label htmlFor="availability">
            <b>Availability</b>
          </label>
          <input
            type="radio"
            name="state"
            value="Available"
            checked={state === "Available"}
            onChange={(e) => setState(e.target.value)}
          />
          <label htmlFor="available">Available</label>
          <input
            type="radio"
            name="state"
            value="Issued"
            checked={state === "Issued"}
            onChange={(e) => setState(e.target.value)}
          />
          <label htmlFor="Issued">Issued</label>
        </div>{" "}
      </div>
      <div className="button-container">
        {" "}
        <button
          onClick={editID !== null ? () => handleUpdate(editID) : handleClick}
        >
          <b>{editID !== null ? "Update" : "Add"}</b>
        </button>
      </div>

      {alert && <h3 style={{ color: "red" }}>{alert}</h3>}
    </div>
  );
}

export default App;
