const mongoose = require("mongoose")

require("../models/Coment")
const Coment = mongoose.model("coments")

require("../models/TasksHistory")
const TasksHistory = mongoose.model("tasksHistory")



async function createComent(user, post, content){

    const createPromise = new Promise((res, rej)=>{
        const coment = new Coment({
            user,
            post,
            content
        })
        coment.save()
        .then(()=>{
            const newTaskHistory = new TasksHistory({
                title: "New coment created",
                model: "coments",
                object_id: coment._id
            })
            newTaskHistory.save()
                .then(()=>{
                    res({status: true, msg: "created", coment: coment})
                })
                .catch(error=>{
                    res({status: false, msg: error})
                })

        })
    })

    return await createPromise
}


async function updateComent(id, user, post, content){
    const promise = new Promise((res, rej)=>{
        const coment = Coment.findOne({_id: id})
            .then(coment=>{
                coment.user = user
                coment.post = post
                coment.content = content
                
                coment.save()
                .then(()=>{
                    const newTaskHistory = new TasksHistory({
                        title: "Coment updated",
                        model: "coments",
                        object_id: coment._id
                    })
                    newTaskHistory.save()
                        .then(()=>{
                            console.log("coment actualizado")
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

async function deleteComent(id){
    const promise = new Promise((res, rej)=>{
        Coment.findOneAndDelete({_id: id})
        .then((coment)=>{
            const newTaskHistory = new TasksHistory({
                title: "Coment deleted",
                model: "coments",
                object_id: coment._id
            })
            newTaskHistory.save()
                .then(()=>{
                    console.log("coment deletado")
                    res({status: true, msg: "deleted"})})
                .catch(error=>{
                    console.log("error ao deletar")
                    res({status: false, msg: error})
                
                })
                       
        })
    })

    return await promise
}

module.exports = {createComent, updateComent, deleteComent}