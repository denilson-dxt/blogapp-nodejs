if (process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://AdminDev:EOCpaP2SVamqyJUR@cluster0.sxbie.mongodb.net/blogdev?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/myblog"}
}