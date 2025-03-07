const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config()

SECRET_KEY = "letsjustsaythisisasecret"
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_DB)
.then(()=>console.log('CONNECTED SUCCESSFULLY'))
.catch(err=>console.log(err));

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    }, 
    password:{
        type:String,
        requried:true
    }
})
const User = mongoose.model("User",UserSchema);

// const verifyToken = (req,res,next)=>{
//     try {
//         const token = req.cookies.process.env.JWT_SECRET_TOKEN
//         if(!token){
//             return res.status(400).send({message:"Invalid"});
//         }
//         req.user = jwt.verify(token,JWT_SECRET_TOKEN);
//         next();
//     } catch (error) {
//         return res.status(401).send({message:"invalid token"})
//     }
// }

app.post('/register',async (req,res) => {
    try {
        const{username,password} = req.body;
        if(!username||!password){
            return res.status(400).send({message:"Enter the credentials"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newuser = await user.create({username,password:hashedPassword});
        
        res.json({message:"User registered successfully"});

    } catch (error) {    
        return res.status(500).send({message:"Server Error"});
    }
});

app.post('/login',async (req,res) => {
    try {
        const{username,password} = req.body;
        const user = await User.findOne({username:username});
        if(!user||!(await bcrypt.compare(password,user.password))){
            return res.status(400).send({message:"Invalid credentials"})
        }

        const token = jwt.sign({username},SECRET_KEY,{expiresIn:'10m'})
        res.cookie("JWT_TOKEN",token,{httpOnly:true})

        return res.status(200).send({message:"Login Successful"})
        
    } catch (error) {
        return res.status(401).send({message:"Sever error"})
    }
})

app.listen(()=>{
    console.log("Server is running in port 3000");
})