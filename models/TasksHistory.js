const mongoose = require("mongoose")
const Schema = mongoose.Schema



const TaskHistory = new Schema({
    title:{
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    model: {
        type: String,
        default:"Not defined"
    },
    object_id:{
        type: String
    }
})



mongoose.model("tasksHistory", TaskHistory)
