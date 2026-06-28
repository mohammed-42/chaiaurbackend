import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser= asynchandler(async (req,res)=>{
  //get user from the frontend
  //validation
  //check if user exists:usename and email
  //check for images
  //check for avatar
  //upload them to cloudnary,avatar
  //create user obj -create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return res
  
  const {fullname,email,username,password}=req.body
  console.log("email:",email);
  /*if(fullname===null){
    throw new apierror(400,"fullname is required");
  }else{
    console.log("fullname:",fullname);
  }*/
 if(
  [fullname,username,email,password].some((field)=>field?.trim()==="")
 ){
  throw new ApiError(400,"all fields are required");
 }
 
 const existUser = User.findOne({
  $or:[{username}, {email}]
 })

 if(existUser) {
  throw new ApiError(409, "user with email already exists")
 }

 const avatarLocalPath=req.files?.avatar[0]?.path;
 const coverImageLocalPath=req.files?.coverimage[0]?.path;

 if(!avatarLocalPath){
  throw new ApiError(400,"Avatar file is required");
 }
const avatar= await uploadOnCloudinary(avatarLocalPath);
const coverImage= await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
  throw new ApiError(400,"Avatar file is required");
}


const user=await User.create({
  fullname,
  avatar:avatar.url,
  coverImage:coverImage?.url || "",
  email,
  password,
  username: username.toLowerCase()
})

const createdUser=await User.findById(user._id).select(
  "-password -refreshToken"
)

if(!createedUser){
  throw new ApiError(508, "something went wrong while reg user")
}

return res.status(201).json(
  new ApiResponse(200,createdUser,"user registered successfully")
)
})



export {registerUser}