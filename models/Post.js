const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    verry_good_votes:{
        type: Number,
        default: 0
    },
    usefull_votes: {
        type: Number,
        default:0
    },
    bad_votes: {
        type: Number,
        default: 0
    }
})



mongoose.model("posts", Post)