const mongoose = require("mongoose")

const ExperienceSchema = new mongoose.Schema({

volunteerId:String,

text:String,

date:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Experience",ExperienceSchema)