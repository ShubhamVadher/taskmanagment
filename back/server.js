require('dotenv').config();
const express=require('express');
const cookie_parser=require('cookie-parser')
const cors = require("cors");
require('./config/connection');
const USER=require('./models/user');
const TASK=require('./models/task');


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

      return res.status(200).json({ name: user.name });
    } else {
      return res.status(200).json({ name: user.name });
    }
  } catch (err) {
    console.error("Error in /signin:", err); // ✅ See DB errors
    return res.status(500).json({ error: "Internal server error" });
  }
});






app.listen(5000,()=>{console.log("Listening over 5000")})