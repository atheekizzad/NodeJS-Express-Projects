import axios from "axios";
import React, { useEffect, useState } from "react";
import "./DeleteView.css";

const DeleteView = (props) => {
  const [files, setFiles] = useState([]);
  const [msg, setmsg] = useState("");
  const render = props.render;

  const fetchFiles = async (ren) => {
    try {
      const response = await axios.get("http://localhost:5000/listofUploads");
      setFiles(response.data.files);
    } catch (err) {
      console.error("failed to fetch", err);
    }
  };
  const handleClick = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/uploads/${filename}`);
      setmsg("Successfully Deleted");
      setTimeout(() => {
        fetchFiles();
        setmsg("");
      }, 5000);
    } catch (err) {
      console.error("failed to Delete", err);
    }
  };
  useEffect(() => {
    fetchFiles(render);
    setmsg("");
  }, [render]);
  return (
    <div>
      {files.length > 0 ? (
        files.map((file, index) => {
          return (
            <li key={index}>
              <a href={`http://localhost:5000/uploads/${file}`} target="_blank">
                {file}
              </a>
              <button onClick={() => handleClick(file)}>Delete</button>
            </li>
          );
        })
      ) : (
        <h2>No file Uploaded</h2>
      )}
      {msg && <h3>{msg}</h3>}
    </div>
  );
};

export default DeleteView;
