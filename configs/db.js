if (process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://AdminDev:<25122000xt-blogdev>@cluster0.sxbie.mongodb.net/<dbname>?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/myblog"}
}