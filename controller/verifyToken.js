const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.TOKEN_SECRET_KEY;

//verify token controller
const verifyToken = async (req, res) => {
  //destructure the request data
  const { token } = req.query;

  //check if the token is present
  if (!token) {
    return res.status(404).json({ success: false, message: "Invalid Token!" });
  }

  //decode the token
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid Token", error: error });
  }

  // check if the user exists
  const userExist = await User.findOne({ email: decoded.email });

  if (!userExist) {
    return res.status(404).json({ success: false, message: "Invalid Token!" });
  }

  // //response
  // res.status(200).json({success: true, data: decoded.email});
  // //http://localhost:3000/resetpassword

  res.redirect(301, `http://localhost:3000/resetpassword?token=${req.body}`);
};

module.exports = verifyToken;
