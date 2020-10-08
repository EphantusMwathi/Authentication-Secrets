//jshint esversion:6
require('dotenv').config({path:process.env.PORT});
const ejs=require("ejs");
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema=new mongoose.Schema({
  username:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ['password']});

const User=mongoose.model("User",userSchema);

app.get("/login",function(req,res){

  res.render("login");
});

app.get("/register",function(req,res){

  res.render("register");
});

app.get("/",function(req,res){
  res.render("home");
});

app.post("/register",function(req,res){

  let newUser=new User({
    username:req.body.username,
    password:req.body.password
  });

  newUser.save(function(err){

    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
      res.redirect("/");
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({username:username},function(err,result){
    if (err) {
      console.log(err);
    }else if(result){
      if (result.password===password) {
        res.render("secrets");
      }else{
        res.redirect("/login");
      }
    }
  });
})

app.listen(8000,function(){

  console.log("Server listening at port 8000....");
});
