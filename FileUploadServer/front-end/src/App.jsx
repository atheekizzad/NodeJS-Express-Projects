import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import DeleteView from "./DeleteView";

function App() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [flag, setFlag] = useState(Date.now());
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/uploads",
        formData
      );
      console.log(response);
      setMsg(response.data.message);
      setFlag(Date.now());
      setTimeout(() => {
        setMsg("");
        setFile(null);
        fileInputRef.current.value = "";
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="App">
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          name="file"
        />
        <button type="submit">Upload</button>
      </form>
      <h2>{msg}</h2>
      <DeleteView render={flag}></DeleteView>
    </div>
  );
}

export default App;
