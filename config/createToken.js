const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.TOKEN_SECRET_KEY;

module.exports = (data) => {
  return jwt.sign(data, SECRET_KEY, { expiresIn: "1h" });
};
