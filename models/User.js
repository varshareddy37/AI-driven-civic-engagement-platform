const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({

name:String,

email:{type:String,unique:true},

password:String,

role:String,

interests:[String],   // NEW

points:{
type:Number,
default:0
}

})

module.exports = mongoose.model("User",UserSchema)