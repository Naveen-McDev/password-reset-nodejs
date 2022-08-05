const bcrypt = require("bcryptjs");
const User = require("../models/user");
const tokenGenerator = require("../config/createToken");
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require("../config/sendEmail");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");

//User registration controller
const registerUser = async (req, res) => {
  try {
    //destructure the body from the request
    const { name, email, password } = req.body;

    //validation

    //check for the inputs are filled
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields!" });
    }

    //check for valid email
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email!" });
    }

    //check for password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be alteast 8 characters",
      });
    }

    //check if the user is already present
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    } else {
      //use model and create new user
      //hash password
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      req.body.password = hash;

      const newUser = new User({ ...req.body });

      //save it in db
      await newUser.save();

      //generate token for email verification
      const token = tokenGenerator({ email: newUser.email });

      //creating verification link
      const link = `https://authentication-bc.herokuapp.com:${process.env.PORT}/api/email/verify?token=${token}`;

      //send email
      const sendMail = await sendVerificationEmail(newUser.email, link);

      if (sendMail) {
        res.status(200).json({
          success: true,
          message:
            "User registered successfully. Error with sending verification email",
        });
      } else {
        //response
        res
          .status(200)
          .json({ success: true, message: "Please check the verification email" });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong in the Registration part",
      error: error,
    });
  }
};

//User login controller
const loginUser = async (req, res) => {
  try {
    //destructure the input from request
    const { email, password } = req.body;

    //validation

    //check for the inputs are filled
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields!" });
    }

    //check if the user is already present
    const userExist = await User.findOne({ email: email });

    //if user does not exist
    if (!userExist) {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    if(!userExist.verified) {
      res.status(400).json({ success: false, message: "You are not Authorized. Complete Your email verification"})
    }

    //if user exists.. then compare the password
    if (userExist) {
      const comparePassword = await bcrypt.compareSync(
        password,
        userExist.password
      );

      if (!comparePassword) {
        res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }

      //if password compared =true.. then generate token
      const token = tokenGenerator({
        email: userExist.email,
        _id: userExist._id,
      });

      //response
      res.status(200).json({
        success: true,
        token: token,
        message: "User Logged in successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong in the Login part",
      error: error,
    });
  }
};

//forgot password controller
const forgotpassword = async (req, res) => {
  try {
    // destructure the input from the request
    const { email } = req.body;

    //if email in not given
    if (!email) {
      res
        .status(400)
        .json({ success: false, message: "Please enter the valid email" });
    }

    //check for valid email
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email!" });
    }

    //check if the user is already present
    const userExist = await User.findOne({ email: email });

    //if user is not present in the db
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found! Please enter valid email!",
      });
    }

    //send forgotPassword email

    //generate token for forgotPassword
    const token = tokenGenerator({ email: userExist.email });

    //creating verification link
    const link = `https://authentication-bc.herokuapp.com:${process.env.PORT}/api/auth/verifyToken?token=${token}`;

    //send email
    const sendMail = await sendForgotPasswordEmail(userExist.email, link);

    if (sendMail) {
      res.status(200).json({
        success: false,
        message: "Error with sending email",
      });
    } else {
      //response
      res.status(200).json({ success: true, message: "Email send" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong in the Login part",
      error: error,
    });
  }
};

//reset password controller
const resetpassword = async (req, res) => {
  try {
    //destructure the request body
    const { email, newpassword, confirmnewpassword } = req.body;

    //check for the inputs are filled
    if (!email || !newpassword || !confirmnewpassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields!" });
    }

    //check for valid email
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email!" });
    }

    //check if the user is already present
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email!" });
    }

    //matching newpassword and confirmnewpassword
    if (newpassword !== confirmnewpassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newpassword, salt);
    const hashedpassword = hash;

    const updatepassword = await User.findOneAndUpdate(
      { email: userExist.email },
      { $set: { password: hashedpassword } }
    );

    if (updatepassword) {
      res
        .status(200)
        .json({ success: true, message: "Password updated Successfully" });
    } else {
      res.status(500).json({
        message: "Something Went Wrong",
        error: error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong in the reset password part",
      error: error,
    });
  }
};

module.exports = { registerUser, loginUser, forgotpassword, resetpassword };
