//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connection
main().catch((err) => console.log(err));

async function main() {
  mongoose.connect("mongodb://localhost:27017/wikiDB");
}

// All code start from here, like for route, create, edit, delete, and other shit things
// Create schema
const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// Route RESTful API
//////////////////////////////////// Request Targeting all article ////////////////////////////////////////////////
app
  .route("/articles")
  .get((req, res) => {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article!");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////////////// Request Targeting a spesific article ////////////////////////////////////////////////

// Display spesific article
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found!");
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Delete data successfully!");
      } else {
        res.send(err);
      }
    });
  });

// Read / Get All articles
// app.get("/articles", function (req, res) {
//   Article.find(function (err, foundArticles) {
//     if (!err) {
//       res.send(foundArticles);
//     } else {
//       res.send(err);
//     }
//   });
// });

// Post or Add new Article
// app.post("/articles", function (req, res) {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   newArticle.save(function (err) {
//     if (!err) {
//       res.send("Successfully added a new article!");
//     } else {
//       res.send(err);
//     }
//   });
// });

// Delete article
// app.delete("/articles", function (req, res) {
//   Article.deleteMany(function (err) {
//     if (!err) {
//       res.send("Successfully deleted all articles.");
//     } else {
//       res.send(err);
//     }
//   });
// });

// For listening to 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
