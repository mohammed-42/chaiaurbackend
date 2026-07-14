import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideo = asynchandler(async(req,res)=>{
   const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
   filter={};
   const vedios = await Vedio.find({})
})
const publishAvideo = asynchandler(async(req,res)=>{
    const {title,description}=req.body
    if((!title || !title.trim())){
      throw new ApiError(400,"title is missing")
    }
    if((!description || !description.trim())){
      throw new ApiError(400,"description is missing")
    }
    const videoLocal=req.files?.videoFile?.[0]?.path;
    const thumbnail=req.files?.videothumbnail?.[0]?.path;

    if(!videoLocal){
      throw new ApiError(400,"video file not recived")
    }
    if(!thumbnail){
      throw new ApiError(400,"thumbnail is missing please upload thumbnail")
    }
    const videofile=await uploadOnCloudinary(videoLocal)
    if(!videofile){
      throw new ApiError(400,"video file upload failed")
    }
    const thumbfile=await uploadOnCloudinary(thumbnail)
    if(!thumbfile){
      throw new ApiError(400,"thumbnail file upload failed")
    }

    const createVideo=await Video.create({
      title,
      description,
      videoFile:videofile.url,
      thumbnail:thumbfile.url,
      duration:videofile.duration,
      owner:req.user._id
    })

    if(!createVideo){
      throw new ApiError(400,"video creation failed")
    }

    return res.
    status(201)
    .json(new ApiResponse(201,createVideo,"video created successfully"))
})
const getVideoById = asynchandler(async(req,res)=>{
   const { videoId }=req.params

   const getvideo=await Video.findById(videoId)
   if(!getvideo){
      throw new ApiError(404,"vedio not found")
   }

   return res
   .status(200)
   .json(new ApiResponse(200,getvideo,"got the vedio"))
})
const updateVideo = asynchandler(async(req,res)=>{
  const {videoId} = req.params
  const {title,description}=req.body
  const thumbnail=req.files?.videothumbnail?.[0]?.path;
   if(!videoId){
    throw new ApiError(404,"video not found")
  }
  let newupload
  if(thumbnail){
    newupload=await uploadOnCloudinary(thumbnail)
  }
    const updateField={
    title:title,
    description:description
    
  }
  if(newupload){
    updateField.thumbnail=newupload.url
  }
 
  const videoupdate=await Video.findByIdAndUpdate(
    videoId,
    {
    $set:updateField
    
  },
  {
    new:true
  }
  )
  if(!videoupdate){
    throw new ApiError(400,"updated failed")
  }
  return res
  .status(200)
  .json(new ApiResponse(200,videoupdate,"vedio updated successfully"))
})
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
      throw new ApiError(400,"please enter vedio to delete")
    }
    const removevideo=await Video.findByIdAndDelete(videoId)
    if(!removevideo){
      throw new ApiError(404,"failed to delete the vedio")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"vedio deleted successfully"))
})
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
      throw new ApiError(404,"vedio not found")
    }
    if(Video.isPublished){
       
    }
})

export {publishAvideo,getVideoById,updateVideo,deleteVideo}
//get all vedios
//publish vedio
//getvedio by id
//updateVedio
//update vedio 
//delete vedio
//togglepublishvedio
