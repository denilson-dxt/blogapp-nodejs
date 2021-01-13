const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")

require("../models/Post")
const Post = mongoose.model("posts")

require("../models/Coment")
const Coment = mongoose.model("coments")

require("../models/ComentAnswer")
const ComentAnswer = mongoose.model("coments_answers")

require("../models/User")
const User = mongoose.model("users")

const {createComent, updateComent, deleteComent} = require("../utils/coments_utils")

const {createComentAnswer, updateComentAnswer, deleteComentAnswer} = require("../utils/coments_answers_utils")

router.get("/", async(req, res)=>{
    let posts = []
    await Post.find().sort({date: "desc"})
        .then(postsList=>{
            posts = postsList
        })
    res.render("home/home", {posts: posts})
})


router.get("/post/:slug", async(req, res)=>{
    let post;
    await Post.findOne({slug: req.params.slug})
        .then(postFound=>{
            post = postFound
        })
    console.log(post)
    let coments;
    await Coment.find({post: post._id}).populate("user")
        .then(comentsList=>{
            coments = comentsList
        })
    res.render("home/post", {post:post, coments: coments})
})


router.post("/post/coments/new-coment", (req, res)=>{
    let {content, post} = req.body
    if (typeof req.user != "undefined"){
        createComent(req.user, post, content)
        .then((response)=>{
            if (response.status){
                res.send({status: true, msg: "coment sent", data: {coment: response.coment,user: req.user, content: content}})
            }else{
                res.send("Comentario nao criado")
            }
        })
    }else{
        User.findOne({username: "Desconhecido"})
        .then(user=>{
            createComent(user._id, post, content)
        .then((response)=>{
            if (response.status){
                res.send({status: true, msg: "coment sent", data: {coment: response.coment,user: user, content: content}})
            }else{
                res.send("Comentario nao criado")
            }
        })
            //res.send({status: false, msg: "No user authenticated"})
        })
        
    }
})

router.get("/post/coments/object/:id/answers", (req, res)=>{
    ComentAnswer.find({coment: req.params.id})
        .populate("user")
        .then(answers=>{
            res.send(answers)
        })
    //res.send(r)
})

router.post("/post/coments/object/:id/answer", async(req, res)=>{
    if (typeof req.user !== "undefined"){
        console.log(req.body)
        console.log("User logado")
        let new_answer = await createComentAnswer(req.user._id, req.params.id, req.body.answer)
        if (new_answer.status){
            res.send({status: true, msg: "Answer sent", data: {user: req.user, content: req.body.answer}})
        }

    }else{
        User.findOne({username: "Desconhecido"})
            .then(async user=>{
                let new_answer = await createComentAnswer(user._id, req.params.id, req.body.answer)
                if (new_answer.status){
                        res.send({status: true, msg: "Answer sent", data: {user: user, content: req.body.answer}})
            }
            })
        //res.send({status: false, msg: "No user authenticated"})
    }

})


router.get("/post/search/keyword=:key/results", (req, res)=>{
    Post.find().where("slug").regex(req.params.key.toLowerCase())
        .then(posts=>{
            res.render("home/search", {key: req.params.key, posts: posts})
        })
})


router.get("/teste", (req, res)=>{
    res.render("home/teste")
})

router.post("/teste", (req, res)=>{
    res.send(req.body)
})


router.post("/post/object/:id/vote", (req, res)=>{
    Post.findById(req.body.post)
        .then(post=>{
            if (req.body.vote_type == "verry good"){
                post.verry_good_votes +=1
            }else if(req.body.vote_type == "usefull"){
                post.usefull_votes +=1

            }else{
                post.bad_votes +=1
            }
            post.save()
            .then(()=>{
                res.send({status: "OK", post: post})
            })
        })
})

module.exports = router