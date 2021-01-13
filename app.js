//Importing modules

    const express = require("express")
    const app = express()
    const home = require("./routes/home")
    const admin = require("./routes/admin")
    const users = require("./routes/users")
    const mongoose = require("mongoose")
    const handlebars = require("express-handlebars")
    const Handlebars = require("handlebars")
    const bodyParser = require("body-parser")
    const Session = require("express-session")

    const passport = require("passport")
    const flash = require("connect-flash")
    const path = require("path")
    require("./configs/auth")(passport)
    //Importing models
    require("./models/User")
    const User = mongoose.model("users")

    const db = require("./configs/db")


//Configs
    //session
    app.use(Session({
        secret: "myblogsecretkey",
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    //middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next()
    })
    //Body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //handlebars
    
    app.engine("handlebars", handlebars({
        defaultLayout: "main",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    }))
    app.set("view engine", "handlebars")
    Handlebars.registerHelper('ifCond', function (value1, cond, value2) {
        return value1 === value2;
      });
      Handlebars.registerHelper("slice", function (text, length){
          return text.slice(0, length)
      })
      
    // mongoose
    mongoose.Promise = global.Promise

    mongoose.connect(db.mongoURI)
        .then(()=>{
            console.log("\nConnected to mongodb")
        })
        .catch(error=>console.log(`\nThe connection with mongodb failed::::${error}`))

    //Public
    app.use(express.static(path.join(__dirname, "public")))


//Routes

    app.use("/", home)
    app.use("/admin", admin)
    app.use("/users", users)
    const PORT = process.env.PORT ||8081

//Starting server

    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`)
    })