const mongoose= require("mongoose");
const {Schema} =mongoose;
const userSchema= new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    hobbies:{type:String,required:true}
   
},{timestamps:true})
module.exports=mongoose.model("User",userSchema,"users")