const QRCode = require("qrcode");

const createQR = async (id, price) => {
  const content = `id:${id},price:${price}`;
  const create = await QRCode.toDataURL(content);
  return create;
};

module.exports = createQR;
