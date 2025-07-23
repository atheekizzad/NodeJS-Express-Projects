const express = require("express");
const logger = require("./Logger.js");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const IO = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const PORT = 4000;
const cors = require("cors");
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "loggers", "cht.txt"));
});

const messages = [];
app.use(cors());

IO.on("connection", (socket) => {
  console.log(`A user is connected - id ${socket.id}`);
  socket.emit("chat history", messages);
  socket.on("send Messages", (data) => {
    console.log(data);
    const newdata = {
      ...data,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    messages.push(newdata);
    IO.emit("receive Message", newdata);

    logger(data, "cht.txt");
  });
  socket.on("typing", (name) => {
    console.log("Starts typing");
    const msg = `${name} is typing...`;
    socket.broadcast.emit("typing", msg);
  });
  socket.on("stoptyping", (name) => {
    console.log("stops typing");
    const msg = "";
    socket.broadcast.emit("stoptyping", msg);
  });
  socket.on("disconnect", () => {
    console.log("disconnected", "id", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Running Sucessfully");
});
