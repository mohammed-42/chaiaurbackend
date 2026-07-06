import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens=async(userId)=>{
  try{
    const user=await User.findById(userId)
    if (!user) {
    throw new Error("User not found");
    }
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}
 
    
  }catch(error){
    console.log(error)
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
  if(!(username || email)){
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
   await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      }
    },
    {
      new :true
    }
   )

   const options={
    httpOnly:true,
    secure:true
  }
   
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200, {},"user logged out"))
})

const refreshAccessToken = asynchandler(async(req,res)=>{
   const incomingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingrefreshtoken){
    throw new ApiError(401,"unauthorized request")
   }
  try {
    const decodedToken = jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id)
  
     if(!user){
      throw new ApiError(401,"invalid refresh token")
     }
  
     if(incomingrefreshtoken !== user?.refreshToken){
        throw new ApiError(401,"refresh token is expired or used")
     }
     const options = {
      httpOnly: true,
      secure:true
    }
  
    const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
  
    return res .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken:newRefreshToken},
        "accessToken refreshed"
      )
    )
  
  } catch (error) {
    throw new ApiError(401,error?.message || "invalid refresh token ")
  }


})

const changeCurrentPassword = asynchandler(async(req,res)=>{
   const {oldPassword,newPassword} = req.body

   const user=await User.findById(req.user?._id)
   const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect){
    throw new ApiError(400,"invalid old password") 
   }

   user.password=newPassword
   await user.save({validateBeforeSave: false})

   return res.status(200)
   .json(new ApiResponse(200,{},"password changed successfully"))
})
const getCurrentUser=asynchandler(async(req,res)=>{
    return res.status(200)
    .json(200,req.user,"current user fetched success fully")
})


const updateAccountDetails=asynchandler(async(req,res)=>{
  const {fullname,email}=req.body

  if(!fullname || !email){
    throw new ApiError(400,"enter details")
  }

  User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullname:fullname,
        email:email
      }
    },
    {new:true}
  ).select("-password")
  return res
  .status(200)
  .json(new ApiResponse(200,user,"Account details updated successfully"))

})

const updateAvatar=asynchandler(async(req,res)=>{
   const avatarLocalPath=req.file?.path

   if(!avatarLocalPath){
    throw new ApiError(400,"Avater file is missing")
   }

   const avatar=uploadOncloudinary(avatarLocalPath)

   if(!avatar.url){
    throw new ApiError(400,"error while uploading on cloudinary")
   }

   const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {
      new:true
    }
   ).select("-password")

    return res
   .status(200)
   .json(new ApiResponse(200),user,"Avatar updated successfully")

})

const updateCoverImage=asynchandler(async(req,res)=>{
   const coverImageLocalPath=req.file?.path

   if(!coverImageLocalPath){
    throw new ApiError(400,"cover image file is missing")
   }

   const coverImage=uploadOncloudinary(coverImageLocalPath)

   if(!coverImage.url){
    throw new ApiError(400,"error while uploading on cloudinary")
   }

   const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {
      new:true
    }
   ).select("-password")

   return res
   .status(200)
   .json(new ApiResponse(200),user,"cover image updated successfully")
})

export {
  registerUser
  ,loginUser
  ,logoutUser
  ,refreshAccessToken
  ,generateAccessAndRefreshTokens
  ,changeCurrentPassword
  ,getCurrentUser
  ,updateAccountDetails
  ,updateAvatar
  ,updateCoverImage
}