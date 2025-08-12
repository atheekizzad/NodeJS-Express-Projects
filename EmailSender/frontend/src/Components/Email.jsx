import { useRef, useState } from "react";
import "./Email.css";
import axios from "axios";

function Email() {
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [cc, setCC] = useState("");
  const [bcc, setBCC] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState([]);
  const [alert, setAlert] = useState("");
  const fileInputRef = useRef(null);

  const handleAlertMessage = (txt) => {
    setAlert(txt);
    setTimeout(() => {
      setAlert("");
    }, 2000);
  };
  const cleanFileds = () => {
    setRecipient("");
    setBCC("");
    setCC("");
    setSubject("");
    setFile([]);
    setMessage("");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!recipient) {
      handleAlertMessage("Please enter the recipient mail address");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("recipient", recipient);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    file.forEach((f) => {
      formData.append("file", f);
    });

    try {
      const res = await axios.post("http://localhost:8000/sendMail", formData); // {
      //headers: { "Content-Type": "multipart/form-data" }, axios will add
      //});
      console.log(res);
      console.log(formData);
      handleAlertMessage(res.data.message);
      cleanFileds();
    } catch (err) {
      console.error(err);
      handleAlertMessage("Failed to Send the Mail");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="App">
      <h1>📂 Email Sender App with NodeJS & ReactJS</h1>
      <form onSubmit={handleSend} encType="multipart/form-data">
        <label htmlFor="recipient">Recipient</label>
        <input
          type="text"
          name="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="eg:123@...com,456@...com"
        />
        <label htmlFor="cc">CC</label>
        <input
          type="text"
          name="cc"
          value={cc}
          onChange={(e) => setCC(e.target.value)}
          placeholder="eg:123@...com,456@...com"
        />
        <label htmlFor="bcc">BCC</label>
        <input
          type="text"
          name="bcc"
          value={bcc}
          onChange={(e) => setBCC(e.target.value)}
          placeholder="eg:123@...com,456@...com"
        />
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <label htmlFor="message">Message</label>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const newFile = Array.from(e.target.files);
            setFile((prev) => [...prev, ...newFile]);
          }}
        />
        <button type="button" onClick={() => fileInputRef.current.click()}>
          Attachements 🔗
        </button>
        {file.length > 0 && (
          <>
            <ul>
              {file.map((f, index) => {
                return (
                  <li key={index}>
                    {f.name}{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setFile((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      ❌
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
      {alert && <h3>{alert}</h3>}
    </div>
  );
}

export default Email;
//e.targert.files
//FileList { length: 2 }
//  0: File { name: "photo1.jpg", lastModified: 1712911221345, size: 24567, type: "image/jpeg" }
//  1: File { name: "document.pdf", lastModified: 1712911256000, size: 120334, type: "application/pdf" }
//  length: 2

//x = [1, 2, 3];
//...x
//console.log(...x);
// prints: 1 2 3
