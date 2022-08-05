const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL

const connect = () => {
    try {
        mongoose.connect(MONGODB_URL);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error)
    }
};

module.exports = connect;