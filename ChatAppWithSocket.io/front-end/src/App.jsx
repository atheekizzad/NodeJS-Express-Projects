import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { useRef } from "react";

const socket = io(`http://localhost:4000/`); //connect to backside origin
function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState("");
  const inputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [nameLocked, setNameLocked] = useState(false);

  useEffect(() => {
    socket.on("chat history", (history) => {
      setChat(history); // ✅ show previous messages
    });
    socket.on("receive Message", (data) => {
      setChat((prev) => [...prev, data]);
    });
    socket.on("typing", (msg) => {
      setTyping(msg);
    });
    socket.on("stoptyping", (msg) => {
      setTyping(msg);
    });
    return () => {
      socket.off("chat history");
      socket.off("receive Message");
      socket.off("typing");
      socket.off("stoptyping");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameLocked(true);
    socket.emit("send Messages", { name, message });
    setMessage("");
    inputRef.current.focus();
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      socket.emit("typing", name);
      setIsTyping(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stoptyping");
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="App">
      <h1>Real Time Chat App with Socket.IO using NodeJS & Express</h1>
      {typing && <p className="typing-indicator">{typing}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
          disabled={nameLocked}
        />
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Message"
        />
        <button type="submit">Send</button>
      </form>

      <div className="chat-container">
        {chat.map((item, index) => {
          return (
            <div
              key={index}
              className={`message ${item.name === name ? "sent" : "received"}`}
            >
              <p className="sender">{item.name}</p>{" "}
              <div className="content">{item.message}</div>{" "}
              <p className="time">{item.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
