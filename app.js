const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Post = require("./models/post.js");
const moment = require("moment")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express();
const dbURI = `mongodb+srv://Oussemaameur:Oussemaameur5@cluster0.klkfq.mongodb.net/posts?retryWrites=true&w=majority`;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .then(()=>console.log('connected'))
  .catch((err) => console.log(err));

  app.set("view engine", "ejs");
  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/posts");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/posts/create", (req, res) => {
  res.render("create", { title: "Create a new post" });
});


app.get("/posts", (req, res) => {
  Post.find().sort({ createdAt: -1 }) 
    .then((result) => {
      res.render("index", { title: "All posts", posts: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/posts", (req, res) => {
  const post = new Post(req.body)
  post.save()
    .then((result) => {
      res.redirect("/posts");
    })
    .catch((err) => {
      console.log(err);
    });
});

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])
app.post('/posts', cpUpload, function (req, res, next) {})

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  Post.findById(id)
    .then(result => {
      res.render('details', { post: result, title: 'Post Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/posts/:id', (req, res) => {
  const id = req.params.id;
  
  Post.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/posts' });
    })
    .catch(err => {
      console.log(err);
    });

});



app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});


app.locals.moment = require('moment');






