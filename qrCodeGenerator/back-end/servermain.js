const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const path = require("path");
const fs = require("fs");
const qrRoutes = require("./Routes/qrroutes.js");

const logger = require("./Logs/Logger.js");
const uploadedDir = path.join(__dirname, "data");

app.use(cors());
app.use((req, res, next) => {
  logger("Generate", "xy.txt");
  next();
});
if (!fs.existsSync(uploadedDir)) {
  fs.mkdir(uploadedDir, (err) => {
    if (err) {
      console.error("failed to make directory");
    } else {
      console.log("directory sucessfully created");
    }
  });
} else {
  console.log("directory already there");
}

app.use("/data", qrRoutes);

app.get("/listofQR", (req, res) => {
  fs.readdir(uploadedDir, (err, files) => {
    if (err) {
      res.status(500).send("failed to read");
    } else {
      res.json({ files });
    }
  });
});
app.listen(PORT, () => {
  console.log("Server listen to port 4000");
});
