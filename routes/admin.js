const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const {convertCheckboxToBoolean} = require("../utils/utils")
require("../models/User")
const User = mongoose.model("users")

require("../models/TasksHistory")
const TasksHistory = mongoose.model("tasksHistory")

require("../models/Post")
const Post = mongoose.model("posts")


require("../models/Coment")
const Coment = mongoose.model("coments")

require("../models/ComentAnswer")
const ComentAnswer = mongoose.model("coments_answers")

const {ModifyUserData, createUser, deleteUser} = require("../utils/users_utils")
const {createPost, updatePost, deletePost} = require("../utils/posts_utils")
const {createComent, updateComent, deleteComent} = require("../utils/coments_utils")
const {createComentAnswer, updateComentAnswer, deleteComentAnswer} = require("../utils/coments_answers_utils")


router.get("/", async (req, res)=>{
    let tasks = []
    let uers = []
    let posts = []
    let coments = []
    await TasksHistory.find()
        .limit(6)
        .sort({date: "desc"})
        .then(tasksList=>{
            tasks = tasksList
            console.log(tasks)
        })
    await User.find().sort({date: "desc"}).limit(6)
        .then(usersList=>{
            users = usersList
        })

    await Post.find().sort({date: "desc"}).limit(6)
        .then(postsList=>{
            posts =postsList
        })

    res.render("admin/home", {TasksHistory: tasks, users: users, posts: posts})

})


router.get("/users", async (req, res)=>{
    let tasks = []
     await TasksHistory.find()
        .limit(6)
        .sort({date: "desc"})
        .then(tasksList=>{
            tasks = tasksList
        })
        .catch(error=>console.log(`Error ${error}`))
        
    await User.find()
        .then(users=>{

            res.render("admin/users", {users: users, TasksHistory: tasks})
            
        })
        .catch(error=>{
            res.redirect("/")
        })
})


router.post("/users/action", async(req, res)=>{
    if (req.body.users){
        if (typeof req.body.users == "string"){
            console.log("Deletado")
            const delete_user = await deleteUser(req.body.users)
            console.log(delete_user)
        }else{
            console.log("Mais de um user")
            req.body.users.forEach((user)=>{
                const delete_user = deleteUser(user)
                console.log(delete_user)
            })
        }
    }else{
        console.log("Nenuhm user")
    }
    res.send(req.body)
})

router.get("/users/object/:id/delete", async(req, res)=>{
    const delete_user = await deleteUser(req.params.id)
    console.log(delete_user)
    if (delete_user){
        res.redirect("/admin/users")
    }else{
        res.redirect(`/admin/users/object/${req.params.id}`)
    }
})


router.get("/users/object/:id", async (req, res)=>{
    let tasks = []
    await TasksHistory.find()
       .limit(6)
       .sort({date: "desc"})
       .then(tasksList=>{
           tasks = tasksList
       })
       .catch(error=>console.log(`Error ${error}`))
   
    User.findOne({_id: req.params.id})
        .then(user=>{
            if (user){
                res.render("admin/user", {user_target: user,TasksHistory: tasks })
            }else{
                res.redirect("/admin/users")
            }
            

        })
        .catch(error=>{
            res.send(`There was an error while getting the user::::: ${error}`)
        })
})


router.post("/users/object/:id/update", async(req, res)=>{
    //Criar uma funcao num arquivo utils para mexer no user
    let {username, first_name, last_name, email, isAdmin, isActive, isSubscribed} = req.body
    
    isAdmin = convertCheckboxToBoolean(isAdmin)
    isActive = convertCheckboxToBoolean(isActive)
    isSubscribed = convertCheckboxToBoolean(isSubscribed)
    
        const modified = ModifyUserData(req.params.id,username, first_name, last_name, email, isAdmin, isActive, isSubscribed)
        if (modified){
            
            res.redirect("/admin/users")
        }else{
            res.redirect(`/admin/users/object/${req.params.id}`)
        }
})


router.get("/users/new-user", async(req, res)=>{
    let tasks = []
    await TasksHistory.find()
       .limit(6)
       .sort({date: "desc"})
       .then(tasksList=>{
           tasks = tasksList
       })
       .catch(error=>console.log(`Error ${error}`))
   
    res.render("admin/newUser", {TasksHistory: tasks})
})


router.post("/users/new-user",async (req, res)=>{

    let {username, first_name, last_name, email, password, isAdmin, isActive, isSubscribed} = req.body
    isAdmin = convertCheckboxToBoolean(isAdmin)
    isActive = convertCheckboxToBoolean(isActive)
    isSubscribed = convertCheckboxToBoolean(isSubscribed)
    let created = await createUser(username, first_name, last_name, isAdmin, isActive, isSubscribed, email, password)
    if (created.status){
        res.redirect("/admin/users")  
    }    
    else{
        res.redirect("/admin/users/new-user")
    }
    //res.redirect("/admin/users")

})


router.get("/posts", async(req, res)=>{
    let tasks = []
    await TasksHistory.find()
       .limit(6)
       .sort({date: "desc"})
       .then(tasksList=>{
           tasks = tasksList
       })
       .catch(error=>console.log(`Error ${error}`))
   
    let posts = []
       await Post.find().sort({date: "desc"})
            .then(postsList=>{
                posts = postsList
            })
       res.render("admin/posts", {TasksHistory: tasks, posts, posts})
})


router.get("/posts/new-post", async (req, res)=>{
    let users = [1, 2, 3]
    await User.find()
        .then((usersList)=>{
            users = usersList
        })
    let tasks = []
    await TasksHistory.find()
       .limit(6)
       .sort({date: "desc"})
       .then(tasksList=>{
           tasks = tasksList
       })
       .catch(error=>console.log(`Error ${error}`)) 
    users.forEach((user)=>{
        console.log(user.username)
    })
    res.render("admin/newPost", {TasksHistory: tasks, users: users})
})

router.post("/posts/new-post", async (req, res)=>{
    const {title, slug, content, user} = req.body
    const created_post = await createPost(title, slug, content, user)
    console.log(`Post creation conmplete ${created_post.status}`)
    if (created_post.status){

        res.redirect("/admin/posts")
    }else{
        console.log(created_post.msg)
        res.redirect("/admin/posts/new-post")
    }
    //res.send(req.body)
})


router.get("/posts/object/:id", async(req, res)=>{
    let post = undefined
    await Post.findOne({_id: req.params.id})
        .then(postFound=>{
            post = postFound
        })
    let users = undefined
    await User.find()
        .then(usersList=>{
            users = usersList
        })
    let tasks = []
    await TasksHistory.find()
        .limit(6)
        .sort({date: "desc"})
        .then(tasksList=>{
            tasks = tasksList
        })
        .catch(error=>console.log(`Error ${error}`))
    
    res.render("admin/post", {post: post, users: users, TasksHistory: tasks})
})


router.post("/posts/object/:id/update", async(req, res)=>{
    const {title, slug, content, user} = req.body
    const update_post = await updatePost(req.params.id, title, slug, content, user)
    if (update_post.status){
        res.redirect("/admin/posts")    
    }else{
        res.redirect(`/admin/posts/object/${req.params.id}`)
    }
    //res.send("Actualizando post")
})


router.get("/posts/object/:id/delete", async(req, res)=>{
    const delete_post = await deletePost(req.params.id)

    if (delete_post.status){
        res.redirect(`/admin/posts`)
    }else{
        res.redirect(`/admin/posts/object/${req.params.id}`)
    }
})


router.post("/posts/action", async(req, res)=>{
    if (req.body.posts){
        if (typeof req.body.posts == "string"){
            console.log("Deletado")
            const delete_user = await deletePost(req.body.posts)
            console.log(delete_user)
        }else{
            console.log("Mais de um user")
            req.body.posts.forEach(async (post)=>{
                const delete_post = await deletePost(post)
                console.log(delete_post)
            })
        }
    }else{
        console.log("Nenuhm post")
    }
    res.redirect("/admin/posts")
})



router.get("/coments", async(req, res)=>{
    let tasks = []
    await TasksHistory.find()
       .limit(6)
       .sort({date: "desc"})
       .then(tasksList=>{
           tasks = tasksList
       })
       .catch(error=>console.log(`Error ${error}`))
   
    let coments = []
       await Coment.find().sort({date: "desc"})
            .then(comentsList=>{
                coments = comentsList
            })
    res.render("admin/coments", {TasksHistory: tasks, coments: coments})
})

router.get("/coments/new-coment", async (req, res)=>{
    let users = [1, 2, 3]
    await User.find()
        .then((usersList)=>{
            users = usersList
        })
    let tasks = []
    await TasksHistory.find()
       .limit(6)
       .sort({date: "desc"})
       .then(tasksList=>{
           tasks = tasksList
       })
       .catch(error=>console.log(`Error ${error}`)) 
    users.forEach((user)=>{
        console.log(user.username)
    })
    let posts = []
    await Post.find().sort({date: "desc"})
        .then(postsList=>{
            posts = postsList
        })
    res.render("admin/newComent", {TasksHistory: tasks, users: users, posts: posts})
})

router.post("/coments/new-coment", async (req, res)=>{
    const {user, post, content} = req.body
    console.log(user)
    console.log(post)
    console.log(content)
    const created_coment = await createComent(user, post, content)
    
    console.log(`Coment creation conmplete ${created_coment.status}`)
    if (created_coment.status){
        res.redirect("/admin/coments")
    }else{
        console.log(created_coment.msg)
        res.redirect("/admin/coments/new-coment")
    }
    //res.send(req.body)
})



router.get("/coments/object/:id", async(req, res)=>{
    let coment = undefined
    await Coment.findOne({_id: req.params.id})
        .then(comentFound=>{
            coment = comentFound
        })
    let users = undefined
    await User.find()
        .then(usersList=>{
            users = usersList
        })
    let tasks = []
    await TasksHistory.find()
        .limit(6)
        .sort({date: "desc"})
        .then(tasksList=>{
            tasks = tasksList
        })
        .catch(error=>console.log(`Error ${error}`))
    let posts = []
    await Post.find()
        .then(postsList=>{
            posts = postsList
        })
    res.render("admin/coment", {coment: coment, users: users, TasksHistory: tasks, posts: posts})
})


router.post("/coments/object/:id/update", async(req, res)=>{
    const {user, post, content} = req.body
    const update_coment = await updateComent(req.params.id, user, post, content)
    if (update_coment.status){
        res.redirect("/admin/coments")    
    }else{
        res.redirect(`/admin/coments/object/${req.params.id}`)
    }
    //res.send("Actualizando post")
})


router.get("/coments/object/:id/delete", async(req, res)=>{
    const delete_coment = await deleteComent(req.params.id)

    if (delete_coment.status){
        res.redirect(`/admin/coments`)
    }else{
        res.redirect(`/admin/coments/object/${req.params.id}`)
    }
})


router.post("/coments/action", async(req, res)=>{
    if (req.body.coments){
        if (typeof req.body.coments == "string"){
            console.log("Deletado")
            const delete_coment = await deleteComent(req.body.coments)
            console.log(delete_coment)
        }else{
            console.log("Mais de um post")
            req.body.coments.forEach(async (coment)=>{
                const delete_coment = await deleteComent(coment)
                console.log(delete_coment)
            })
        }
    }else{
        console.log("Nenuhm coment")
    }
    res.redirect("/admin/coments")
})









router.get("/coments_answers", async(req, res)=>{
    let tasks = []
    await TasksHistory.find()
       .limit(6)
       .sort({date: "desc"})
       .then(tasksList=>{
           tasks = tasksList
       })
       .catch(error=>console.log(`Error ${error}`))
   
    let coments_answers = []
    await ComentAnswer.find().sort({date: "desc"})
        .then(comentsAnswersList=>{
            coments_answers = comentsAnswersList
        })
    res.render("admin/coments_answers", {TasksHistory: tasks, coments_answers: coments_answers})
})

router.get("/coments_answers/new-coment_answer", async (req, res)=>{
    let users = [1, 2, 3]
    await User.find()
        .then((usersList)=>{
            users = usersList
        })
    let tasks = []
    await TasksHistory.find()
       .limit(6)
       .sort({date: "desc"})
       .then(tasksList=>{
           tasks = tasksList
       })
       .catch(error=>console.log(`Error ${error}`)) 
    users.forEach((user)=>{
        console.log(user.username)
    })
    let coments = []
    await Coment.find().sort({date: "desc"})
        .then(comentsList=>{
            coments = comentsList
        })
    res.render("admin/newComent_answer", {TasksHistory: tasks, users: users, coments: coments})
})

router.post("/coments_answers/new-coment_answer", async (req, res)=>{
    const {user, coment, content} = req.body
    console.log(user)
    console.log(coment)
    console.log(content)
    const created_coment_answer = await createComentAnswer(user, coment, content)
    
    console.log(`Coment creation conmplete ${created_coment_answer.status}`)
    if (created_coment_answer.status){
        res.redirect("/admin/coments_answers")
    }else{
        console.log(created_coment_answer.msg)
        res.redirect("/admin/coments_answers/new-coment_answer")
    }
    //res.send(req.body)
})



router.get("/coments_answers/object/:id", async(req, res)=>{
    let coment_answer;
    await ComentAnswer.findOne({_id: req.params.id})
        .then(comentAnswerFound=>{
            coment_answer = comentAnswerFound
        })
    let users;
    await User.find()
        .then(usersList=>{
            users = usersList
        })
    let tasks = []
    await TasksHistory.find()
        .limit(6)
        .sort({date: "desc"})
        .then(tasksList=>{
            tasks = tasksList
        })
        .catch(error=>console.log(`Error ${error}`))
    let coments = []
    await Coment.find()
        .then(comentsList=>{
            coments = comentsList
        })
    res.render("admin/coment_answer", {coment_answer: coment_answer, users: users, TasksHistory: tasks, coments: coments})
})


router.post("/coments_answers/object/:id/update", async(req, res)=>{
    const {user, coment, content} = req.body
    const update_coment_answer = await updateComentAnswer(req.params.id, user, coment, content)
    if (update_coment_answer.status){
        res.redirect("/admin/coments_answers")    
    }else{
        res.redirect(`/admin/coments_answers/object/${req.params.id}`)
    }
    //res.send("Actualizando post")
})


router.get("/coments_answers/object/:id/delete", async(req, res)=>{
    const delete_coment_answer = await deleteComentAnswer(req.params.id)

    if (delete_coment_answer.status){
        res.redirect(`/admin/coments_answers`)
    }else{
        res.redirect(`/admin/coments_answers/object/${req.params.id}`)
    }
})


router.post("/coments_answers/action", async(req, res)=>{
    if (req.body.coments_answers){
        if (typeof req.body.coments_answers == "string"){
            console.log("Deletado")
            const delete_coment_answer = await deleteComentAnswer(req.body.coments_answers)
            console.log(delete_coment_answer)
        }else{
            console.log("Mais de um post")
            req.body.coments_answers.forEach(async (coment_answer)=>{
                const delete_coment_answer = await deleteComentAnswer(coment_answer)
                console.log(delete_coment_answer)
            })
        }
    }else{
        console.log("Nenuhm coment")
    }
    res.redirect("/admin/coments_answers")
})



module.exports = router