const mongoose=require('mongoose')
const conn=process.env.connectionString;
const connect=mongoose.connect(conn);

module.exports=mongoose.connection;