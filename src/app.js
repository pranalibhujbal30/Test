const express= require('express');
const path= require("path");
const app=express();
const hbs = require("hbs");
const jwt=require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const shuffleArray = require("shuffle-array");

require("./db/conn");
const Register = require("./models/registers");
const Post = require("./models/posts");

const port= process.env.PORT || 3000;
const static_path=path.join(__dirname, "../public");

const template_path1=path.join(__dirname, "../templates/views");
const partials_path=path.join(__dirname, "../templates/partials");

global.username ;


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));

app.set("view engine", "ejs");


app.set("views" , template_path1);
hbs.registerPartials(partials_path);

app.get("/", (req,res) => {
    res.render("index")

});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/post",auth,(req,res)=>{
    //const user_id=auth().verifyUser._id;
    res.render("post");
});




//create a new user in our database
app.post("/register", async(req,res)=>{
    try{
        const registerUser = new Register({
            name : req.body.name,
            email : req.body.email,
            gender : req.body.gender,
            password : req.body.password
        })
        //console.log("the success part: "+registerUser);
        
        const token = await registerUser.generateAuthToken();
        //console.log("the token part: "+token);

        const registered =await registerUser.save();
        console.log("Registration successful");
        
        res.status(201).render("index");


    } catch(error){
        res.status(400).send(error);
        console.log("the error part page");
    }
});

//login
app.post("/login",async(req,res)=>{
    try{
        const email= req.body.email;
        const password= req.body.password;

        const useremail = await Register.findOne({email:email});
        const token = await useremail.generateAuthToken();
        

        res.cookie("jwt", token,{
           expires:new Date(Date.now()+6000000),
            httpOnly:true,
        });

        if(useremail.password=== password){
            console.log("Login successful");
            console.log("user_id: "+useremail._id);
            console.log("the token : "+token);
            res.cookie("user_id",useremail._id,{
                expires:new Date(Date.now()+6000000),
                 httpOnly:true,
             });
             res.status(201).render("index");
        }
        else{
            res.send("invalid credentials");

        }
        

    } catch(error){
        res.status(400).send("invalid login");
    }
})

//create post
app.post("/post",async(req,res)=>{
    try{
        console.log("creating a post");
        const user_id=req.cookies.user_id;
       // console.log('user id is:' +user_id);

       const useremail = await Register.findOne({_id:user_id});
        const post = new Post({
            post_title : req.body.post_title,
            post_content : req.body.post_content,
            post_tags : req.body.post_tags,
            post_auther : user_id,
            auther_name: useremail.name
        })

        console.log("the post : "+post);

        //const token = req.cookies.jwt;
        //console.log("token is: "+token);

        const postCreated =await post.save();
        console.log("Post created successfully")

        res.status(201).render("index");
    

    }catch(error){
        res.status(404).send("error in post creation");
    }
});

//get all posts
app.get("/getAllPosts",auth,async(req,res) => {
    try{
        console.log("show all posts");

       const postsData= await Post.find();
     // res.send(postsData) ;
       console.log(postsData);
       res.render("getPosts",{postsData});

    }catch(error){
        res.status(404).send(error);
    }
});

app.get("/like",auth,async(req,res) => {
    try{

      
       const post_id=req.body.post_auther;
       console.log("post id:"+post_id);


        
      console.log("like working");
      res.send("like");

          res.render("getPosts",{postsData});

    } catch(error){
        res.status(404).send(error);
    }

});


app.listen(port, ()=>{
    console.log(`server is running on port no ${port}`);
});