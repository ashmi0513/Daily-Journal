//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//Connecting to the BlogDB
mongoose.connect("mongodb+srv://ashmi-admin:test1234@cluster0.y5yga2r.mongodb.net/JournalDB");

//Creating BlogPost Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

//Creating Model
const blogPost = mongoose.model("blogPost", postSchema);

const homeStartingContent = "Daily Journal will help you to maintain the soft copy of your journal. Even when carefully kept, paper journals can be read by anyone who happens upon them. Daily Journal keeps your journals safe and saved with us. You can create, read , modify and delete your content anytime from any where. Headover to '+' button once you are ready";
const aboutContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";
const contactContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req , res){

  blogPost.find(function(err , foundPosts){
    if(!err)
    {
      res.render("home",{StartingContent:homeStartingContent, Posts: foundPosts});
    }
  });

});

app.get("/contact", function(req , res){
  res.render("contact",{ContactContent:contactContent});
});

app.get("/about", function(req , res){
  res.render("about",{AboutContent:aboutContent});
});

app.get("/compose", function(req , res){
  res.render("compose");
});

app.post("/compose", function(req , res){
  let title = req.body.postTitle;
  let body = req.body.postContent;

  const post = new blogPost({
    title: title,
    content: body
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
 });

app.get("/posts/:postID" , function(req , res){

  let postid = req.params.postID;
  blogPost.findOne({_id: postid} , function(err , foundPost){
      if(!err)
      {
        res.render("post", {PostTitle:foundPost.title , PostContent: foundPost.content});
      }
      else{
        res.render("/");
      }
  });

});

app.get("/delete/:postID" , function(req , res){
  let postid = req.params.postID;
  blogPost.deleteOne({_id: postid} , function(err){
      if(err)
      {
        console.log(err);
        res.send("Invalid Post");
      }
  });

  res.redirect("/");

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port " + port);
});
