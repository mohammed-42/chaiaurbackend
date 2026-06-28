import mongose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=new Schema({
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
  coverimage:{
    type:String
  },
  watchHistory:[
    {
      type:Schema.Types.ObjectId,
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

},{timeStamps});

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return(next);

  this.password=await bcrypt.hash(this.password,10);
  next();
})
userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.method.generateAccessToken=function(){
  return jwt.sign(
    {
      _id=this.id,
      email:this.email,
      username:this.username,
      fullname=this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,{
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.method.generateRefreshToken=function(){
  return jwt.sign(
    {
      _id=this_id,
    },
    process.env.REFRESH_TOKEN_SECRET,{
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

userSchema.method

export const User=mongoose.model("User",userSchema);