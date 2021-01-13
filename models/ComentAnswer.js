const mongoose = require("mongoose")
const Schema = mongoose.Schema;



const ComentAnswer = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    coment: {
        type: Schema.Types.ObjectId,
        ref: "coments",
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


mongoose.model("coments_answers", ComentAnswer)