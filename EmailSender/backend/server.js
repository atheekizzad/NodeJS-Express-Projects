const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config(); //Loads environment variables from a .env file for config & secrets management
const PORT = 8000;
const morgan = require("morgan"); //Logs incoming HTTP requests for debugging and monitoring
app.use(morgan("dev")); //"dev" is a predefined logging format that outputs colored concise info ouput-POST /sendMail 200 34ms
const multer = require("multer");
const path = require("path");
app.use(cors());
app.use(express.json());
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdir(uploadDirectory, (err) => {
    if (err) {
      console.error("failed to create Directory", err);
    } else {
      console.log("directory Created");
    }
  });
} else {
  console.log("directory already there");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const sendMail = (recipient, subject, message, cc, bcc, attachments, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  //const mailOptions = {
  // from: process.env.EMAIL_USER,
  // to: recipient,
  // subject: subject,
  // text: message,
  //};
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient.split(",").map((x) => x.trim()), //string to array and remove extra space
    subject: subject,
    text: message,
    cc: cc ? cc.split(",").map((x) => x.trim()) : undefined,
    bcc: bcc ? bcc.split(",").map((x) => x.trim()) : undefined,
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error Occured", error);
      res.status(500).send("Error in sending Mail");
    } else {
      console.log("email sent", info.response);
      res.json({ message: "Email sent succesfully " });
    }
  });
};
app.post("/sendMail", upload.array("file"), async (req, res) => {
  const { recipient, subject, message, cc, bcc } = req.body;
  const files = req.files; // array have objects as element

  const attachments = files.map((f) => ({
    filename: f.originalname,
    path: f.path,
  }));

  sendMail(recipient, subject, message, cc, bcc, attachments, res);
});

app.listen(PORT, () => console.log(`server is running on ${PORT} sucessfully`));
