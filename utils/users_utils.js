const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")
const bcryptjs = require("bcryptjs")
require("../models/TasksHistory")
const TasksHistory = mongoose.model("tasksHistory")
/*
async function ModifyUserDataa(user_id=null,username, first_name, last_name, email, isAdmin=false, isActive=true, isSubscribed=false){
    if (user_id){
        await User.findOne({_id: user_id})
            .then(user=>{
                console.log(`User encontrado ${user.username}` )
                user.username = username
                user.first_name = first_name
                user.last_name = last_name
                user.email = email
                user.isAdmin = isAdmin
                user.isActive = isActive
                user.isSubscribed = isSubscribed
                console.log(`Dados recebidos ${username, first_name, last_name, email, isAdmin, isActive}`)
                user.save()
                    .then(()=>{
                        
                        console.log(`User salvo ${user.username}` )
                        return {status: true}
                    })
                    .catch(error=>{
                        
                    console.log(`User nao salvo ${user.username} ${error}` )
                        return {error}
                    })
            })
    }else{
        console.log("Nenhum user")
    }
}
*/
async function ModifyUserData(user_id=null,username, first_name, last_name, email, isAdmin=false, isActive=true, isSubscribed=false){
    let status = false
    if (user_id){
        const promise = new Promise((res, rej)=>{
            User.findOne({_id: user_id})
            .then(user=>{
                console.log(`User encontrado ${user.username}` )
                user.username = username
                user.first_name = first_name
                user.last_name = last_name
                user.email = email
                user.isAdmin = isAdmin
                user.isActive = isActive
                user.isSubscribed = isSubscribed
                console.log(`Dados recebidos ${username, first_name, last_name, email, isAdmin, isActive}`)
                user.save()
                    .then(()=>{
                        
                        console.log(`User salvo ${user.username}` )
                        const newTask = new TasksHistory({
                            title: `User ${user.username} updated`,
                            model: "users",
                            object_id: user._id
                        })
                        newTask.save()
                        .then(()=>{
                            
                            res(true)
                        
                        })
                        //return {status: true}
                    })
                    .catch(error=>{
                        
                    console.log(`User nao salvo ${user.username} ${error}` )
                        res(error)
                    })
            })
            
        })
        status = await promise
        return status
        //console.log(`Olha esse reultado brilhante ${re}`)
    }else{
        console.log("Nenhum user")
    }
}


async function createUser(username, first_name, last_name, isAdmin=false, isActive=true, isSubscribed=false, email, password){
    
    const check_user = await User.findOne({email: email})
    .then((user)=>{
        if (user){
            return false
        }
        return true
    }) 
    console.log(`verificacao de user ${check_user}`)
    
    if (!check_user){
        console.log("Este user ja existe")
        return {status: false, msg: "This email is already being used"}
    }

    const user = new User({
        username,
        first_name,
        last_name,
        isAdmin,
        isActive,
        isSubscribed,
        email,
        password
    })
    var status = false
    
    const getHashAndSaveUser = new Promise((res, rej)=>{
        
        bcryptjs.genSalt(10, (error, salt)=>{
            bcryptjs.hash(user.password, salt, (error, hash)=>{
                if (error){
                    console.log(error)

                }else{
                    user.password = hash
                    user.save()
                    .then(()=>{
                        const newTask = new TasksHistory({
                            title: "New user created",
                            model: "users",
                            object_id: user._id
                        })
                        newTask.save()
                        .then(()=>{
                            res({status: true, msg: "User created"})
                            status = {status: true, msg: "User created"}
    
                        })
                    })
                }
            })
        })
    })
    await getHashAndSaveUser
    console.log("status")
    return  status
}


async function deleteUser(id){
    let status = false
    const promise = new Promise((res, rej)=>{
        const user =  User.findOne({_id: id})
                .then(user=>{
                    if (user){
                        user.delete()
                        .then(()=>{
                            const newtask = new TasksHistory({
                                title: `User ${user.username} deleted`,
                                model: "users",
                                object_id: user._id
                            })
                            newtask.save()
                            .then(()=>{
                                res(true)
                            //res.send(req.body)
                            })
                        })
                    }else{
                        console.log(`User nao encontrado ${id}`)
                        res(false)
                        //res.send("Este user nao existe")
                    }
                    
                })
    })
    status = await promise
    console.log(`Depois de deletar o user ${status}`)
    return status

}

module.exports = {ModifyUserData, createUser, deleteUser}