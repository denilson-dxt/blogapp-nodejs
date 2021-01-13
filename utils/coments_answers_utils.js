const mongoose = require("mongoose")

require("../models/ComentAnswer")
const ComentAnswer = mongoose.model("coments_answers")

require("../models/TasksHistory")
const TasksHistory = mongoose.model("tasksHistory")



async function createComentAnswer(user, coment, content){

    const createPromise = new Promise((res, rej)=>{
        const comentAnswer = new ComentAnswer({
            user,
            coment,
            content
        })
        comentAnswer.save()
        .then(()=>{
            const newTaskHistory = new TasksHistory({
                title: "New coment answer created",
                model: "coments_answers",
                object_id: comentAnswer._id
            })
            newTaskHistory.save()
                .then(()=>{
                    res({status: true, msg: "created"})
                })
                .catch(error=>{
                    res({status: false, msg: error})
                })

        })
    })

    return await createPromise
}


async function updateComentAnswer(id, user, coment, content){
    const promise = new Promise((res, rej)=>{
        const comentAnswer = ComentAnswer.findOne({_id: id})
            .then(comentAnswer=>{
                comentAnswer.user = user
                comentAnswer.coment = coment
                comentAnswer.content = content
                
                comentAnswer.save()
                .then(()=>{
                    const newTaskHistory = new TasksHistory({
                        title: "Coment answer updated",
                        model: "coments_answers",
                        object_id: comentAnswer._id
                    })
                    newTaskHistory.save()
                        .then(()=>{
                            console.log("coment answer actualizado")
                            res({status: true, msg: "updated"})
                        })
                        .catch(error=>{
                            console.log("error ao update")
                            res({status: false, msg: error})
                        
                        })
                    
                })
                .catch(error=>{
                    console.log("error ao update")
                    res({status: false, msg: error})
                })
            })

    })

    return await promise
}

async function deleteComentAnswer(id){
    const promise = new Promise((res, rej)=>{
        ComentAnswer.findOneAndDelete({_id: id})
        .then((comentAnswer)=>{
            const newTaskHistory = new TasksHistory({
                title: "Coment answer deleted",
                model: "coments_answers",
                object_id: comentAnswer._id
            })
            newTaskHistory.save()
                .then(()=>{
                    console.log("coment answer deletado")
                    res({status: true, msg: "deleted"})})
                .catch(error=>{
                    console.log("error ao deletar")
                    res({status: false, msg: error})
                
                })
                       
        })
    })

    return await promise
}

module.exports = {createComentAnswer, updateComentAnswer, deleteComentAnswer}