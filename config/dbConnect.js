//mongoose package
const mongoose = require("mongoose");

//mongodb url
const MONGODB_URL = process.env.MONGODB_URL

const connect = () => {
    try {
        //connecting with mongodb database
        mongoose.connect(MONGODB_URL);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error)
    }
};

//export
module.exports = connect;