import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens=async(userId)=>{
  try{
    const user=User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}
 
    
  }catch(error){
    throw new ApiError(500,"somthing went wrong while generating access token ")
  }
}

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
  //console.log("email:",email);
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
 
 const existUser = await User.findOne({
  $or:[{username}, {email}]
 })

 if(existUser) {
  throw new ApiError(409, "user with email already exists")
 }

 const avatarLocalPath=req.files?.avatar?.[0]?.path;
 const coverImageLocalPath=req.files?.coverImage?.[0]?.path;

 if(!avatarLocalPath){
  throw new ApiError(400,"Avatar file is required");
 }
const avatar= await uploadOncloudinary(avatarLocalPath);

const coverImage= await uploadOncloudinary(coverImageLocalPath);

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

if(!createdUser){
  throw new ApiError(500, "something went wrong while reg user")
}

return res.status(201).json(
  new ApiResponse(200,createdUser,"user registered successfully")
)
})

const loginUser=asynchandler(async (req,res)=>{
  //req body -> data 
  //username and email
  //find the user
  //password check 
  //access and ref token 
  //send cookie

  const {email,username,password}=req.body
  if(!username || !email){
    throw new ApiError(400,"username and email are required")
  }
  const user=await User.findOne({
    $or:[{username},{email}]
  })
  if(!user){
    throw new ApiError(404,"user does not exists please register first")
  }
  const isPasswordvalid=await user.isPasswordCorrect(password)

  if(!isPasswordvalid){
    throw new ApiError(401,"email or password is in valid")
  }

  const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

  const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

  const options={
    httpOnly:true,
    secure:true
  }

  return res.
  status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggedInUser,accessToken,refreshToken
      },
      "user logged in successfully"
    )
  )


})

const logoutUser=asynchandler(async(req,res)=>{
  
})



export {registerUser,loginUser}