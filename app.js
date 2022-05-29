//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

const PORT = 5000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

const article1 = new Article({
    title: "Cat",
    content: "The cat is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it from the wild members of the family. "
});
const article2 = new Article({
    title: "Dog",
    content: "The dog or domestic dog is a domesticated descendant of the wolf, and is characterized by an upturning tail. The dog is derived from an ancient, extinct wolf, and the modern wolf is the dog's nearest living relative. "
});

const defaultArticles = [article1, article2];


app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (foundArticles.length === 0) {
                Article.insertMany(defaultArticles, function (err1) {
                    if (err1) {
                        console.log(err1);
                    }
                    else {
                        console.log("succesfully inserted default articles.");
                    }
                });
                res.redirect("/articles");
            }
            else {
                if (!err) res.send({ articles: foundArticles });
                else res.send(err);
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (err) res.send(err);
            else res.send("Article created");
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) res.send("Successfully deleted all articles");
            else res.send(err);
        });
    });


app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            }
            else {
                res.send("Article not found");
            }
        });
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Article changed");
                }
            }
        );
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Article updated successfully");
                }
                else {
                    res.send(err);
                }
            }
        );
    })
    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function (err) {
            if (err) res.send(err);
            else res.send("Article deleted successfully");
        });
    });


app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});