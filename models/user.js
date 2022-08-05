const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    emailverificationtoken: {
        type: String,
        default: ""
    },
    verified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const User = mongoose.model("users", userSchema);

module.exports = User;