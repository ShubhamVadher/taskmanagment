const mongoose=require('mongoose');

const user_schema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    tasks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'task'
        }
    ]
})

module.exports=mongoose.model('user',user_schema);