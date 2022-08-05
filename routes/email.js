const express = require("express");
const { verifyEmail } = require("../controller/email");
const router = express.Router();

//verify email
router.get("/verify", verifyEmail);



module.exports = router;