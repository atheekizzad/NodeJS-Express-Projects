import { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";

function UserManagement() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [msg, setMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [editingID, setEditingID] = useState(null);

  const setAlert = (txt) => {
    setMsg(txt);
    setTimeout(() => {
      setMsg("");
    }, 5000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { id, name, Email, age };
    try {
      const res = await axios.post("http://localhost:4600/adds", userData);
      setId("");
      setName("");
      setEmail("");
      setAge("");
      setAlert(res.data.message);
      fetchedDataFromBackend();
    } catch (err) {
      console.error(err);
      setAlert("Failed to Add User");
    }
  };

  const fetchedDataFromBackend = async () => {
    try {
      const res = await axios.get("http://localhost:4600/");
      console.log(res);
      const data = res.data;
      setUsers(data);
    } catch (err) {
      console.error(err);
      setAlert("Fetched Failed");
    }
  };
  useEffect(() => {
    fetchedDataFromBackend();
  }, []);

  const handleDelete = async (id) => {
    if (editingID) {
      return setAlert("Close the Editing Tab");
    }
    try {
      const res = await axios.delete(`http://localhost:4600/${parseInt(id)}`);
      setAlert(res.data.message);
      fetchedDataFromBackend();
      console.log(res.data.message);
    } catch (err) {
      console.error(err);
      setAlert("Failed to Delete");
    }
  };

  const handleEdit = async (arrayElement) => {
    setId(arrayElement.id);
    setName(arrayElement.name);
    setEmail(arrayElement.Email);
    setAge(arrayElement.age);
    setEditingID(arrayElement.id);
  };

  const handleupdate = async (keyID) => {
    const updateUser = { id, name, Email, age };
    try {
      const res = await axios.put(
        `http://localhost:4600/update/${keyID}`,
        updateUser
      );

      setId("");
      setName("");
      setEmail("");
      setAge("");
      setEditingID(null);
      setAlert(res.data.message);
      fetchedDataFromBackend();
    } catch (err) {
      setAlert("Failed to update");
    }
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setEditingID(null);
    setId("");
    setName("");
    setEmail("");
    setAge("");
  };
  return (
    <div>
      <h1> 👥 User Management System 🧑‍💻 With React + NodeJS ExpressJS</h1>
      <form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          editingID ? handleupdate(editingID) : handleSubmit(e);
        }}
      >
        <h3>Enter the User Details Here.......</h3>
        <input
          type="number"
          value={id}
          placeholder="Enter the ID"
          onChange={(e) => setId(e.target.value)}
          required
          disabled={editingID !== null}
        />
        <input
          type="text"
          value={name}
          placeholder="Enter the User Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          value={Email}
          placeholder="Enter the User email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          value={age}
          placeholder="Enter the User age"
          onChange={(e) => setAge(e.target.value)}
          required
        />{" "}
        <div className="button-container">
          <button type="submit">
            {editingID ? "Update User" : "Add User"}
          </button>
          {editingID && (
            <button type="submit" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
        <h3>{msg}</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.Email}</td>
                  <td>{user.age}</td>
                  <td>
                    <button type="button" onClick={() => handleDelete(user.id)}>
                      🗑️ Delete
                    </button>
                  </td>
                  <td>
                    <button type="button" onClick={() => handleEdit(user)}>
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default UserManagement;
