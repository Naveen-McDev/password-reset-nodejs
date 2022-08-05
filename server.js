const express = require("express");
const cors = require("cors")

const dotenv = require("dotenv");
dotenv.config();

const dbConnect = require("./config/dbConnect");
const User = require("./models/user");
const userRouter = require("./routes/auth");
const emailRouter = require("./routes/email");

//connecting to db
dbConnect();

const PORT = process.env.PORT || 5000;
app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRouter);
app.use("/api/email", emailRouter);

app.listen(PORT, () => {
  console.log(`Web server is running on the Port : ${PORT}`);
});
