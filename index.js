const express = require("express");
const dotenv=require("dotenv")
dotenv.config();

const mongoose = require("mongoose");
const User = require("./models");
mongoose.connect(
  "mongodb+srv://anshu:123456anshu@cluster0.8zkogz0.mongodb.net/crudtest",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("DB connected");
});
const app = express();
const cors=require("cors");
const { request } = require("express");
const corsOptions ={
   origin:'*', 
   credentials:true, //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/saveuser", async(req,res)=>{
    console.log(req.body)
    if (req.body) {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          hobbies: req.body.hobbies,
          
        });
    let result;
    try {
        result=await user.save();
    } catch (error) {
        console.log(error)
    }
    res.json({result})
}
})
app.put("/updateuser/:id",async(req,res,next)=>{

    let data;
    try {
        data=await User.findByIdAndUpdate({_id:req.params.id},req.body,{new:true})
res.json(data)
    } catch (error) {
       console.log(error) 
    }
})
app.get("/allusers",async(req,res)=>{
    try {
        const users= await User.find()
        res.json(users)
    } catch (error) {
        console.log(error)
    }
})

app.delete("/deleteuser/:id",async(req,res)=>{
    console.log(req.params)
    try {
        await User.deleteOne({_id:req.params.id});
        res.json({message:"successfuly deleted"})
    } catch (error) {
        console.log(error)
    }
})
app.post("/sendmail",async(req,res)=>{
    try {
        var nodemailer=require("nodemailer");
var transporter= nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:"anshuk.ug19.ph@nitp.ac.in",
        pass:process.env.EMAIL_PASS

    }
})
let rowdata="";
for (let i = 0; i < req.body.length; i++) {
   
    rowdata+=`<tr>
     <td>${req.body[i].id}</td>
     <td>${req.body[i].name}</td>

     <td>${req.body[i].phone}</td>

     <td>${req.body[i].email}</td>
     <td>${req.body[i].hobbies}</td>

     </tr>`
    
}
var mailOptions={
    from:"anshuk.ug19.ph@nitp.ac.in",
    to:"info@redpositive.in",  
    subject:"see allusers",
    html:`<html>
     
      
        
          <table align="center" width="800" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #ccc;">
        
          ${rowdata}
          </table>
        
     
    
    </html>`



    
}
transporter.sendMail(mailOptions,function(error,info){
if(error){
    console.log(error);
}
else{
   return  res.json({message:"email has been sent"})
    
    console.log("email has been sent",info.response);
}

})
    } catch (error) {
        res.json({error})
       console.log(error); 
    }

})
  





app.listen(9000, () => {
    console.log("server");
  });
  