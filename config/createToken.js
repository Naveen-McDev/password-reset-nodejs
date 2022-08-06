//jwt package
const jwt = require('jsonwebtoken');
//.env package
const dotenv = require("dotenv");

//config .env file
dotenv.config();

//token secret key
const SECRET_KEY = process.env.TOKEN_SECRET_KEY;

//export
module.exports = (data) => {
  return jwt.sign(data, SECRET_KEY, { expiresIn: "1h" });
};
