const mongoose =require("mongoose");
const express =require("express");
const cors= require("cors");
const multer =require("multer");
const jsonwebtoken =require("jsonwebtoken");
const bcrypt =require("bcrypt");
const dotenv =require("dotenv");
dotenv.config();
const path = require("path");

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, "./client/build")));

let authorise = (req, res, next) => {
    console.log("inside authorise middleware function");
    console.log(req.headers["authorization"]);  
    next();
};
app.use(authorise);

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
      cb(null,'uploads')
    },
    filename:(req, file, cb) =>{
        console.log(file);
      
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  })
  
  const upload = multer({ storage: storage });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.post("/signup", upload.single("profilePic"), async(req,res)=>{
    console.log(req.body.profilePic);
    console.log(req.file);

    let hashedPassword = await bcrypt.hash(req.body.password, 10);


    try{
        let newUser= new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            gender:req.body.gender,
            age:req.body.age,
            email:req.body.email,
            password:hashedPassword,
            mobileNo:req.body.mobileNo, 
            profilePic: req.file ? req.file.filename : '' // Save filename
        });
        console.log("Inserted Data into Database");
        await User.insertMany([newUser]);
        res.json({msg:"User created"});
    }catch(err){
        console.log(err);
        console.log("Unable to Insert Data into Database");
        res.json({msg:"Unable to create user"});
    }
});

app.post("/Login", upload.none(),async (req,res) => {
    console.log(req.body);
let userArray=await User.find({email:req.body.email})

if(userArray.length >0){

    let passwordMatch = await bcrypt.compare(req.body.password, userArray[0].password);
    console.log(".......")
    console.log(userArray[0]);
    console.log(".......")

    if(passwordMatch==true){

        let token = jsonwebtoken.sign({email:req.body.email,password:req.body.password}, "ombheembush");
        let dataToSend={
            firstName:userArray[0].firstName,
            lastName:userArray[0].lastName,
            gender:userArray[0].gender,
            age:userArray[0].age,
            email:userArray[0].email,
            mobileNo:userArray[0].mobileNo,
            profilePic:userArray[0].profilePic,
            token:token,
        }
        res.json({msg:"User found", data:dataToSend});
    }
    else{
        res.json({msg:"Invalid password"})
    }
}else{
    res.json({msg:"User not found"});
}
});

app.post("/validateToken", upload.none(),async (req,res) => {
    console.log(req.body);

    let decryptedCredentials = jsonwebtoken.verify(req.body.token, "ombheembush");
    console.log(decryptedCredentials);
let userArray=await User.find().and({email:decryptedCredentials.email})

if(userArray.length >0){
    console.log(".......")
    console.log(userArray[0]);
    console.log(".......")

    if(userArray[0].password==decryptedCredentials.password)
        {
            let dataToSend={
            firstName:userArray[0].firstName,
            lastName:userArray[0].lastName,
            gender:userArray[0].gender,
            age:userArray[0].age,
            email:userArray[0].email,
            mobileNo:userArray[0].mobileNo,
            profilePic:userArray[0].profilePic,
            token:req.body.token,
        }
        res.json({msg:"User found", data:dataToSend});
    }
    else{
        res.json({msg:"Invalid password"})
    }
}else{
    res.json({msg:"User not found"});
}
});

app.patch("/updateProfile", upload.single("profilePic"), async(req,res)=>{

    try{
        console.log(req.body);
   

        if(req.body.firstName.trim().length>0){
          await User.updateMany(
                {email:req.body.email},
                {firstName:req.body.firstName}
            );
        }
        
        if(req.body.lastName.trim().length>0){
            await User.updateMany(
                  {email:req.body.email},
                  {lastName:req.body.lastName}
              );
          }
        
          if(req.body.age>0){
            await User.updateMany(
                  {email:req.body.email},
                  {age:req.body.age}
              );
          }
        
          if(req.body.gender.trim().length>0){
            await User.updateMany(
                  {email:req.body.email},
                  {gender:req.body.gender}
              );
          }
        
          if(req.body.password.length>0){
            await User.updateMany(
                  {email:req.body.email},
                  {password:req.body.password}
              );
          }
           
          if(req.body.mobileNo.trim().length>0){
            await User.updateMany(
                  {email:req.body.email},
                  {mobileNo:req.body.mobileNo}
              );
          }

          if(req.file){
            await User.updateMany(
                  {email:req.body.email},
                  {profilePic:req.file.path}
              );
          }
          res.json({msg:"Profile updated"});
    }catch(err){
       res.json({msg:"Unable to update profile"});
    }   
});

app.delete("/deleteProfile", upload.none(), async(req,res)=>{
   try {
        console.log(req.body);
        let deleteObj= await User.deleteMany({email:req.body.email});
       
        if(deleteObj.deletedCount>0){
            res.json({msg:"Profile deleted"});
        }
        else{
            res.json({msg:"Profile not deleted"});
        }
    } catch (err) {
    res.json({msg:"Unable to delete profile"});
    }
});

app.listen(process.env.port,()=>{
    console.log(`listening to port ${process.env.port}`);
});
    
let userSchema =new mongoose.Schema({
    firstName:String,
    lastName:String, 
    gender:String,
    age:Number,
    email:String,
    password:String,
    mobileNo:String,
    profilePic:String, // Change to array of strings
});

let User =new mongoose.model("users", userSchema,"users");

let connectToMDB= async()=>{
console.log(process.env.mongodburl);
    mongoose.connect(process.env.mongodburl);
    try{
        console.log("You successfully connected to MongoDB!");
        //insertDataIntoDB();
    }catch(err){
        console.log("Unable to connect to MDB");
    }
};
connectToMDB();