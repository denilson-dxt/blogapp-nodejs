const mongoose = require("mongoose")
const Schema = mongoose.Schema;



const Coment = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "posts",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date
    }
})


mongoose.model("coments", Coment)