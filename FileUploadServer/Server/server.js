const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const uploadDirectory = path.join(__dirname, "uploads");

app.use(cors());

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdir(uploadDirectory, (err) => {
    if (err) {
      console.error("failed to created directory", err);
    } else {
      console.log("Directory Created");
    }
  });
} else {
  console.log("Directory already there");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploads = multer({ storage: storage });

app.post("/uploads", uploads.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("no files Uploaded");
  } else {
    res.send({ message: "file uploaded", file: req.file });
  }
});

app.get("/uploads", (req, res) => {
  res.sendFile(path.join(__dirname, "response.html"));
});

app.use("/uploads", express.static(uploadDirectory));

app.get("/listofUploads", (req, res) => {
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      res.status(500).send("failed to read files");
    } else {
      res.json({ files });
    }
  });
});

app.delete("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadDirectory, filename);
  console.log(filepath);
  fs.unlink(filepath, (err) => {
    if (err) {
      console.error("failed to fetch", err);
      return res.status(500).send("failed to delete");
    }
    res.send({ message: "successfully deleted the files" });
  });
});
app.listen(PORT, () => console.log(`successfully run on ${PORT}`));
