const jwt= require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async(req, res, next) =>{
    try{
        const token = req.cookies.jwt;
        
        const verifyUser = jwt.verify(token,"mynameispranaliandiamanengineer");
       // console.log(verifyUser);

        const user = await Register.findOne({_id:verifyUser._id});
        
        next();
        return token,user;
    }catch(error){
        res.status(401).send("Please Login");
        console.log("Not logged in");
    }






}

module.exports = auth;