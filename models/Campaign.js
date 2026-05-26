const mongoose = require("mongoose")

const CampaignSchema = new mongoose.Schema({

issueId:String,

title:String,

category:String,

date:String,

time:String,

volunteersRequired:Number,

volunteers:[String],

attendance:[String],

status:{
type:String,
default:"Campaign Created"
}

})

module.exports = mongoose.model("Campaign",CampaignSchema)