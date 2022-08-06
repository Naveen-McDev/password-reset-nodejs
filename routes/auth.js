const express = require("express");

const {
  registerUser,
  loginUser,
  forgotpassword,
  resetpassword,
} = require("../controller/auth");
const verifyToken = require("../controller/verifyToken");
const router = express.Router();

//authorization
function authorize (req, res, next) {
  if(req.headers.authorization) {
    let decode = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET_KEY);
    console.log(decode);
    if(decode) {
      next()
    } else {
      res.status(401).json({sucess: "false", message: "Your are not Authorized"});
    }
  } else {
    res.status(401).json({sucess: "false", message: "Your are not Authorized"});
  }
}


//User registration Api
router.post("/register", registerUser);

//User login Api
router.post("/login", loginUser);

//Forgot password Api
router.post("/forgotpassword", forgotpassword);

//Verify token
router.get("/verifyToken", verifyToken);

//Reset Password
router.post("/resetpassword", resetpassword);

module.exports = router;