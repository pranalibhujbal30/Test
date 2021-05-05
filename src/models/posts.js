const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const postSchema = new mongoose.Schema({
        post_title:{
            type:String
        },
        post_content:{
            type:String
        },
        post_tags : {
            type:String
        },
        post_auther :{
            type:String
        },
        auther_name:{
            type:String

        },
        post_like : [{
            _id : String,
            name : String


        }],

        post_dislike : [{
            _id : String,
            name : String
        }],

        post_comment : [{
            comment : String,
            _id : String,
            name: String
        }]

})



const Post = new mongoose.model("Post", postSchema);

module.exports= Post;