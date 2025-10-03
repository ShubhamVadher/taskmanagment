require('dotenv').config();
const express=require('express');
const cookie_parser=require('cookie-parser')
const cors = require("cors");
require('./config/connection');
const USER=require('./models/user');
const TASK=require('./models/task');
const jwt=require('./jwt/gentoken');
const gentoken = require('./jwt/gentoken');
const isloggedin=require('./middleware/isloggedin')
const {mail}=require('./mailing/mail');


const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie_parser());

app.use(cors({
  origin: "http://localhost:3000", // React dev server
  credentials: true,
}));

app.post("/signin", async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await USER.findOne({ email });

    if (!user) {
      user = await USER.create({ name, email });
    }

    const tok = gentoken(user);


  
    return res.status(200).cookie("Token",tok).json({ name: user.name });
  } catch (err) {
    console.error("Error in /signin:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/logout', isloggedin, (req, res) => {
  res.clearCookie('Token'); 
  return res.status(200).send('Logged out successfully');
});

app.post("/createtask", isloggedin, async (req, res) => {
  try {
    const { name, members} = req.body;
    
    const current_user = req.user;
    if (!current_user) {
      
      return res.status(401).json({ message: "User not authenticated" });
    }
   
    let finalMembers = [...members];
    finalMembers.push(current_user.email)
    // if (self) finalMembers.push(current_user.email);

    
    finalMembers = [...new Set(finalMembers)];
   

    

    
    const memberIds = [];
    for (const memberEmail of finalMembers) {
      
      const user = await USER.findOne({ email: memberEmail });
      if (!user) {
        
        return res
        .status(400)
        .json({ message: `Email ID ${memberEmail} could not be found` });
      }
      memberIds.push(user._id);
    }
    
    finalMembers.forEach((element) => {
        mail(element,current_user.name,name);
    });

    
    
    
    const task = await TASK.create({
      task_name: name,
      created_by: current_user._id,
      members: memberIds, 
    });
    
    memberIds.forEach(async(member)=>{
      const user=await USER.findOne({_id:member});
      user.tasks.push(task._id);
      await user.save();
    })
    

    return res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


app.get("/gettasks", isloggedin, async (req, res) => {
  try {
    const current_user = req.user;
    if (!current_user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    
    const userWithTasks = await USER.findById(current_user._id)
      .populate({
        path: "tasks",
        populate: [
          { path: "created_by", select: "name email" },
          { path: "members", select: "name email" },
          { path: "update.member", select: "name email" }
        ]
      });

    if (!userWithTasks) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ tasks: userWithTasks.tasks });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/updatetask/:id",isloggedin,async(req,res)=>{
  let id=req.params.id;
  const task=await TASK.findOne({_id:id});
  const obj={member:req.user._id,message:req.body.message};
  task.update.push(obj);
  await task.save();

  return res.status(200).json("update successful");
})

app.get("/complete/:id", isloggedin, async (req, res) => {
  try {
    const task_id = req.params.id;
    const user_id = req.user._id;

    const task = await TASK.findById(task_id);

    

    
    if (!task.created_by.equals(user_id)) {
      return res
        .status(201)
        .json({ message: "Only the creator of the task can mark this as complete" });
    }

    task.completed = true;
    await task.save();

    return res.status(200).json({ message: "Task marked as completed" });
  } catch (err) {
    console.error("Error completing task:", err);
    return res.status(500).json({ message: "Server error" });
  }
});




const port=process.nextTick.PORT||5000

app.listen(port,()=>{console.log("Listening over 5000")})