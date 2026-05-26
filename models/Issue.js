const mongoose = require("mongoose")

const IssueSchema = new mongoose.Schema({

image:String,

description:String,

location:String,

phone:String,

status:{
type:String,
default:"Reported"
},

createdBy:String

})

module.exports = mongoose.model("Issue",IssueSchema)