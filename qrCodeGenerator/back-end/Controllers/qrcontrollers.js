const createQR = require("../Services/qrservice.js");

const generateQR = async (req, res) => {
  const id = req.body.id;
  const price = req.body.price;

  if (!id || !price) {
    res.status(400).json({ message: "Both Field Required" });
  } else {
    try {
      const genQRURL = await createQR(id, price);
      res.json({ message: "QR Generated", qr: genQRURL });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "failed to create QR" });
    }
  }
};

module.exports = generateQR;
