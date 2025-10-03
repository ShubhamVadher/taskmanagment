const User=require('../models/user');
const jwt=require('jsonwebtoken');

const Key=process.env.key;
const isloggedin=async(req,res,next)=>{
    try{
        if(!req.cookies.Token||req.cookies.Token==''){
        
        return res.status(500).json({message:"You must login first1"});
    }
    const data=jwt.verify(req.cookies.Token,Key);
    const user=await User.findOne({email:data.email});
    if(!user){
            window.alert('please login first');
            return res.status(500).json({message:"You must login first2"});
        }
        req.user=user;
        next();
    }
    catch(err){
        console.log(err);
    }

}
module.exports=isloggedin;