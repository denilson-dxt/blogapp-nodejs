const mongoose = require("mongoose")
const Schema = mongoose.Schema


const User = new Schema({
    username: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String
    },
    isAdmin: {
        type:Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})




mongoose.model("users", User)