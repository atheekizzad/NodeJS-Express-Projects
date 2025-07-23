const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const qrController = require("../Controllers/qrcontrollers.js");

router.post("/", upload.none(), qrController);
router.get("/", (req, res) => {
  res.send("You are posting to this url");
});

module.exports = router;
