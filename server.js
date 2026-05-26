const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const cors = require("cors")

const User = require("./models/User")
const Issue = require("./models/Issue")
const Campaign = require("./models/Campaign")

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static("public"))
app.use("/uploads",express.static("uploads"))

/* ---------------- MONGODB ---------------- */

mongoose.connect("mongodb://127.0.0.1:27017/connectforcause")
.then(()=>console.log("MongoDB Connected"))


/* ---------------- IMAGE UPLOAD ---------------- */

const storage = multer.diskStorage({

destination:"uploads/",

filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage})


/* ---------------- SIGNUP ---------------- */

app.post("/signup", async(req,res)=>{

const {name,email,password,role,interests} = req.body

const user = new User({

name,
email,
password,
role,
interests

})

await user.save()

res.json({message:"User created"})

})


/* ---------------- LOGIN ---------------- */

app.post("/login", async(req,res)=>{

const {email,password} = req.body

const user = await User.findOne({email,password})

if(!user){

return res.json({message:"Invalid login"})
}

res.json({

userId:user._id,
role:user.role

})

})


/* ---------------- REPORT ISSUE ---------------- */

app.post("/report", upload.single("image"), async(req,res)=>{

const issue = new Issue({

image:req.file.filename,
description:req.body.description,
location:req.body.location,
phone:req.body.phone,
userId:req.body.userId,
status:"Reported"

})

await issue.save()

res.json({message:"Issue reported"})

})

const { exec } = require("child_process")

app.post("/generate-description",(req,res)=>{

exec("python caption.py",(err,stdout,stderr)=>{

if(err) return res.send("error")

res.json({description:stdout})

})

})

/* ---------------- GET ALL ISSUES ---------------- */

app.get("/issues", async(req,res)=>{

const issues = await Issue.find()

res.json(issues)

})


/* ---------------- GET USER ISSUES ---------------- */

app.get("/my-issues/:userId", async(req,res)=>{

const issues = await Issue.find({
userId:req.params.userId
})

res.json(issues)

})


/* ---------------- CREATE CAMPAIGN ---------------- */

app.post("/create-campaign", async(req,res)=>{

const {issueId,title,category,date,time,volunteersRequired} = req.body

const campaign = new Campaign({

issueId,
title,
category,
date,
time,
volunteersRequired,
volunteers:[],
attendance:[],
status:"Campaign Created"

})

await campaign.save()

res.json({message:"Campaign created"})

})


/* ---------------- GET CAMPAIGNS ---------------- */

app.get("/campaigns", async(req,res)=>{

const campaigns = await Campaign.find()

res.json(campaigns)

})


/* ---------------- RECOMMENDED CAMPAIGNS ---------------- */

app.get("/recommended-campaigns/:userId", async(req,res)=>{

const user = await User.findById(req.params.userId)

const campaigns = await Campaign.find({

category:{ $in:user.interests }

})

res.json(campaigns)

})


/* ---------------- JOIN CAMPAIGN ---------------- */

app.post("/join-campaign", async(req,res)=>{

const {campaignId,volunteerId} = req.body

await Campaign.findByIdAndUpdate(

campaignId,

{
$addToSet:{volunteers:volunteerId}
}

)

res.json({message:"Joined campaign"})

})


/* ---------------- UPDATE CAMPAIGN STATUS ---------------- */

app.put("/update-campaign-status", async(req,res)=>{

const {campaignId,status} = req.body

await Campaign.findByIdAndUpdate(campaignId,{
status:status
})

res.json({message:"Status updated"})

})


/* ---------------- DELETE CAMPAIGN ---------------- */

app.delete("/delete-campaign/:id", async(req,res)=>{

await Campaign.findByIdAndDelete(req.params.id)

res.json({message:"Campaign deleted"})

})


/* ---------------- GET USER (REWARDS PAGE) ---------------- */

app.get("/user/:id", async(req,res)=>{

const user = await User.findById(req.params.id)

res.json(user)

})

app.post("/add-experience", async(req,res)=>{

const {volunteerId,text} = req.body

const exp = new Experience({

volunteerId,
text

})

await exp.save()

res.json({message:"Experience added"})

})

app.post("/mark-attendance", async(req,res)=>{

const {campaignId,volunteerId} = req.body

await Campaign.findByIdAndUpdate(

campaignId,

{
$addToSet:{attendance:volunteerId}
}

)

await User.findByIdAndUpdate(

volunteerId,

{
$inc:{points:10}
}

)

res.json({message:"Attendance marked"})

})

/* ---------------- SERVER ---------------- */

app.listen(5000,()=>{

console.log("Server running on port 5000")

})