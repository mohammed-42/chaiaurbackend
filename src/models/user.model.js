import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=new mongoose.Schema({
  username:{
    type: String,
    required:true,
    unique:true,
    lowercase:true,
    index:true,
    trim:true
  },
  email:{
    type: String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  fullname:{
    type: String,
    required:true,
    lowercase:true,
    index:true
  },
  avatar:{
    type:String,
    required:true,
  },
  coverImage:{
    type:String
  },
  watchHistory:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"vedio"
    }
  ],
  password:{
    type:String,
    required:[true,'password is required']
  },
  refreshToken:{
    type:String
  }

},{timeStamps:true});

/*userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password=await bcrypt.hash(this.password,10);
  next();
})*/
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.method.generateAccessToken=function(){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,{
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.method.generateRefreshToken=function(){
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,{
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

userSchema.method

export const User=mongoose.model("User",userSchema);