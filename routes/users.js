const express = require("express")
const router = express.Router()
const bcryptjs = require("bcryptjs")
const passport = require("passport")
const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")
const {createUser} = require("../utils/users_utils")

router.get("/login", (req, res)=>{
    res.render("users/login")
})

router.post("/login", (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
})


router.get("/signup", (req, res)=>{
    res.render("users/signup")
})

router.post("/signup", async(req, res)=>{
    const {username, first_name, last_name, email, password} = req.body
    /*const user = new User({
        username,
        first_name,
        last_name,
        email,
        password
    })
    console.log(user)
    bcryptjs.genSalt(10, (error, salt)=>{
        bcryptjs.hash(user.password, salt, (error, hash)=>{
            if (error){
                console.log(`\n, error ${error}`)
            }else{
                user.password = hash
                console.log(user)
                user.save()
                    .then(()=>{
                        console.log("User criado")
                        res.redirect("/users/login")
                    })
                    .catch(error=>{
                        console.log(`\n, houve um error ${error}`)
                        res.redirect("/users/signup")
                    })
            }
        })
        
    })
    */
   let created = await createUser(username, first_name, last_name, false, true, false, email, password)
    if (created.status){
        res.redirect("/users/login")  
    }    
    else{
        res.redirect("/users/signup")
    }
   //res.send("Criado user")
})

router.get("/logout", (req, res)=>{
    req.logOut()
    res.redirect("/")
})

module.exports = router

