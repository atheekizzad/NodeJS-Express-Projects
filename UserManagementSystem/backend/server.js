const express = require("express");
const app = express();
const PORT = 4600;
const cors = require("cors");
const path = require("path");
const fs = require("fs");
app.use(express.json());
app.use(cors());

const userFilePath = path.join(__dirname, "data", "users.json");

const readingDatabase = () => {
  const data = fs.readFileSync(userFilePath, "utf-8");
  return JSON.parse(data);
  //data='[{"id":1,"name":"Alice","Email":"alice@example.com","age":25},{"id":2,"name":"Bob","Email":"bob@example.com","age":30}]'
  //JSON.parse(data);//JSON string and converts it into a JavaScript object/array
  // x=readingDatabase() is array
};

const writingFile = (content) => {
  fs.writeFileSync(userFilePath, JSON.stringify(content, null, 2));
  //JSON.stringify(content, null, 2)- way to convert a JavaScript object or array (content) into a nicely formatted JSON string.
};

app.get("/", (req, res) => {
  const users = readingDatabase();
  res.json(users);
  // users is an array ,- the client will receive a JSON array.
});

app.post("/adds", (req, res) => {
  const newUser = req.body;
  const users = readingDatabase();
  const idExistingChecking = users.some(
    (user) => parseInt(user.id) === parseInt(newUser.id)
  );
  if (idExistingChecking) {
    return res.status(210).json({ message: "ID already Exists" });
  }
  users.push(newUser);
  writingFile(users);
  res.status(201).json({ message: "User added", user: newUser });
});

app.delete("/:id", (req, res) => {
  const users = readingDatabase();
  const id = parseInt(req.params.id);
  const userToDelete = users.find((u) => parseInt(u.id) === id);
  if (!userToDelete) {
    return res.status(404).json({ message: "User Not Found" });
  } else {
    const updatedUsers = users.filter((user) => parseInt(user.id) !== id);
    writingFile(updatedUsers);
    res
      .status(200)
      .json({ message: "Succesfully Deleted", user: userToDelete });
  }
});

app.put("/update/:keyID", (req, res) => {
  const users = readingDatabase();
  const id = parseInt(req.params.keyID);
  const indexToEdit = users.findIndex((u) => parseInt(u.id) === id);
  const updateUser = req.body;
  if (indexToEdit === -1) {
    return res.status(404).json({ message: "User Not Found for Update" });
  }
  users[indexToEdit] = updateUser;
  writingFile(users);
  res.status(200).json({ message: "Successfully Updated ", user: updateUser });
});
app.listen(PORT, () => console.log("server is running"));
