const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const PORT = process.env.PORT || 4000;
const uploadedDir = path.join(__dirname, "data");
const QRCode = require("qrcode");
const logger = require("./Logs/Logger");

app.use(cors());

app.use(async (req, res, next) => {
  await logger("Generate", "log.txt");
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

app.post("/data", upload.none(), async (req, res) => {
  const id = req.body.id;
  const price = req.body.price;
  if (!id || !price) {
    return res
      .status(400)
      .json({ message: "Both field required check please" });
  } else {
    const qrContent = `ID:${id},Price:${price}`;
    try {
      const qrCreation = await QRCode.toDataURL(qrContent);
      const fileName = `${id}_${Date.now()}.png`;
      const qrCreationFile = await QRCode.toFile(
        path.join(uploadedDir, fileName),
        qrContent
      );
      res.json({ message: "QR Generated", qr: qrCreation });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "failed to create QR" });
    }
  }
});
app.listen(PORT, () => {
  console.log("Server running on 4000 successfully yes");
});
