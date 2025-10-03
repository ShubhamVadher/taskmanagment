const jwt=require('jsonwebtoken');
const KEY=process.env.key;
const gentoken=(user)=>{
    const token=jwt.sign({name:user.name,email:user.email,id:user._id},KEY);
    return token;
}
module.exports=gentoken;