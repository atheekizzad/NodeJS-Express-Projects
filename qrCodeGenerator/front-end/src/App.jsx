import { useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [id, setId] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [qr, setQr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !price) {
      setMsg("Both field Required");
    }
    const formData = new FormData();
    formData.append("id", id);
    formData.append("price", price);

    try {
      const response = await axios.post(`http://localhost:4000/data`, formData);
      console.log(response);
      setMsg(response.data.message);
      setQr(response.data.qr);
    } catch (err) {
      console.error(err);
      setMsg("Posting Failed");
    }
  };
  const handleReset = () => {
    setId("");
    setPrice("");
    setMsg("");
    setQr(null);
  };
  return (
    <div className="App">
      <h2>QR Generation with NodeJS & Express JS</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="id">Enter ID</label>
        <input
          type="number"
          placeholder="Enter ID"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          min="1"
        />
        <label htmlFor="Price">Enter Price</label>
        <input
          type="number"
          placeholder="Enter price"
          id="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="20"
        />
        <button type="submit">Submit</button>
      </form>
      {msg && <h3>{msg}</h3>}
      <img src={qr}></img>
      <a href={qr} download="qr.png">
        Download
      </a>
      <button className="reset-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}

export default App;
