const mongoose = require("mongoose")

require("../models/Post")
const Post = mongoose.model("posts")

require("../models/TasksHistory")
const TasksHistory = mongoose.model("tasksHistory")



async function createPost(title, slug, content, user){
    
    const check_post = await Post.findOne({slug: slug})
    .then((post)=>{
        if (post){
            console.log(post)
            return false
        }
        return true
    })

    if (!check_post){
        return {status: false, msg: "This slug is already in use"}
    }
    console.log(check_post)
    console.log("Creating post")

    const createPromise = new Promise((res, rej)=>{
        const post = new Post({
            title,
            slug,
            content,
            user
        })
        post.save()
        .then(()=>{
            const newTaskHistory = new TasksHistory({
                title: "New post created",
                model: "posts",
                object_id: post._id
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


async function updatePost(id, title, slug, content, user){
    const promise = new Promise((res, rej)=>{
        const post = Post.findOne({_id: id})
            .then(post=>{
                post.title = title
                post.slug = slug
                post.content = content
                post.user = user

                post.save()
                .then(()=>{
                    const newTaskHistory = new TasksHistory({
                        title: "Post updated",
                        model: "posts",
                        object_id: post._id
                    })
                    newTaskHistory.save()
                        .then(()=>{
                            console.log("post actualizado")
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

async function deletePost(id){
    const promise = new Promise((res, rej)=>{
        Post.findOneAndDelete({_id: id})
        .then((post)=>{
            const newTaskHistory = new TasksHistory({
                title: "Post deleted",
                model: "posts",
                object_id: post._id
            })
            newTaskHistory.save()
                .then(()=>{
                    console.log("post deletado")
                    res({status: true, msg: "deleted"})})
                .catch(error=>{
                    console.log("error ao deletar")
                    res({status: false, msg: error})
                
                })
                       
        })
    })

    return await promise
}

module.exports = {createPost, updatePost, deletePost}