const nodemailer = require("nodemailer");

//to send email to fake account
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "naveenkrishch@gmail.com",
    pass: "xwzfzouncjrvfogw",
  },
});

//to send email to real email account
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, //true for port 465, // false for other port
//   auth: {
//     user: account.user, //generated ethereal user
//     pass: account.pass, //generated ethereal password
//   },
// });

module.exports = {
  sendVerificationEmail: async (receiverAddress, link) => {
  let error = false;
  try {
    await transporter.sendMail({
      from: "naveenkrishch@gmail.com",
      to: receiverAddress,
      subject: "Verify Email",
      html: `Please verify your email by clicking <a href="${link}">Here</a> <br /> 
                This link will be valid for only 1 hour`,
    });
  } catch (error) {
    error = true;
  }
  return error;
},
  sendForgotPasswordEmail: async (receiverAddress, link) => {
  let error = false;
  try {
    await transporter.sendMail({
      from: "naveenkrishch@gmail.com",
      to: receiverAddress,
      subject: "Reset Password",
      html: `Reset your password by clicking <a href="${link}">Here</a> <br /> 
                This link will be valid for only 1 hour`,
    });
  } catch (error) {
    error = true;
  }
  return error;
},
};
