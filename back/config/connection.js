const mongoose=require('mongoose')

const connect=mongoose.connect('mongodb://localhost:27017/task');

module.exports=mongoose.connection;