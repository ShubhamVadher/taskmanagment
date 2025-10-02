const mongoose = require("mongoose");

const task_schema = mongoose.Schema({
  task_name: {
    type: String,   
    required: true, 
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }
  ],
  update: [
    {
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
      message: {
        type: String,
        required: true,
      }
    }
  ],
  completed:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model("task", task_schema);
