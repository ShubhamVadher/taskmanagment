const jwt=require('jsonwebtoken');
const KEY=process.env.ADMINKEY;
const admintoken=()=>{
    const token = jwt.sign({ role: "admin" }, KEY, { expiresIn: '1d' })
    return token;
}
module.exports=admintoken;