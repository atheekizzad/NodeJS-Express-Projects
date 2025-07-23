const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logger = async (message, logname) => {
  const datetime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logitem = `${datetime}\t${uuid()}\t${JSON.stringify(message)}\n`;

  try {
    const direct = path.join(__dirname, "loggers");
    console.log(direct);
    if (!fs.existsSync(direct)) {
      await fsPromises.mkdir(direct, { recursive: true });
      console.log("successfully created");
    } else {
      console.log("dirdctory there");
    }
    await fsPromises.appendFile(path.join(direct, logname), logitem);
  } catch (err) {
    console.error(err);
  }
};

module.exports = logger;
