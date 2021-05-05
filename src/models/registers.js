const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
    name :{
        type:String,
        required : true
    },
    email :{
        type:String,
        required : true,
        unique: true
    },
    gender :{
        type:String,
        required : true
    },
    password :{
        type:String,
        required : true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

   
})


//generating tokens
registerSchema.methods.generateAuthToken =async function(){
    try{
        //console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},"mynameispranaliandiamanengineer" );
        this.tokens = this.tokens.concat({token:token})
       // console.log("token created: "+token);
        await this.save();
        return token;

    } catch(error){
        res.send("the error part"+error);
        consol.log("the error part "+error );

    }
}

//collection creation

const Register = new mongoose.model("Register", registerSchema);

module.exports= Register;