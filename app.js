const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect to Database
mongoose.connect("mongodb://localhost:27017/wikiDB")
    .then( () => console.log("Database Connected!"))
    .catch( (err) => console.log(err) );

// Make a Schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Register a model or Create a collection in DB
const Article = mongoose.model("Article", articleSchema);



//////////////////////////////////////////Request Targetting All Articles/////////////////////////////////


app.route("/articles")

.get(function(req, res){

    Article.find()
        .then((foundArticles) => {
            res.send(foundArticles);
        })
        .catch((err) => {
            res.send(err) ;
        })

})

.post(function(req, res){

    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    article.save()
        .then(() => {
            res.send("Successfully added a new article.");
        })
        .catch((err) => {
            res.send(err);
        });

})

.delete( function(req, res){

    Article.deleteMany()
        .then(() => {
            res.send("Successfully deleted all articles.");
        })
        .catch((err) => {
            res.send(err);
        })
});


//////////////////////////////////////Request Targetting A Specific Article////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

    Article.findOne({title: req.params.articleTitle})
        .then((foundArticle) => {
            res.send(foundArticle);
        })
        .catch((err) => {
            res.send(err);
        })
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}
    )
        .then( () => {
            res.send("Successfully updated article.");
        })
        .catch((err) => {
            res.send(err);
        })
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    )
        .then( () => {
            res.send("Successfully updated the article!");
        })
        .catch( (err) => {
            res.send(err);
        })
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle}
    )
        .then( () => {
            res.send("Successfully deleted the article");
        })
        .catch( (err) => {
            res.send(err);
        })
});


app.listen(3000, () => {
    console.log("Server is started on port 3000");
})