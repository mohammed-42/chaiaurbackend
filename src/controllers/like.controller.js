import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId){
        throw new ApiError(400,"no vedio found")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"vedio not found")
    }
    const existingLike=await Like.findOne({
        video:videoId,
        likedBy:req.user._id
    })
    if(existingLike){
       await Like.findByIdAndDelete(existingLike._id)

       return res.status(200)
       .json(new ApiResponse(200,"vedio unliked"))
    }else{
        const like=await Like.create({
            video:videoId,
            likedBy:req.user._id
        })

        return res 
        .status(200)
        .json(new ApiResponse(200,"video liked"))

    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId){
        throw new ApiError(400,"no comment")
    }
    
    const commentslike=await Like.findOne({comment:commentId,likedBy:req.user._id})

    if(commentslike){
        await Like.findByIdAndDelete(commentslike._id)

        return res
        .status(200)
        .json(new ApiResponse(200,"comment unliked"))
    }else{
        const createcomment=await Like.create({
            comment:commentId,likedBy:req.user._id
        })

        return res
        .status(200)
        .json(new ApiResponse(200,"comment liked"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId){
        throw new ApiError(400,"no comment")
    }
    const tweetlike=await Like.findOne({tweet:tweetId,likedBy:req.user._id})

    if(tweetlike){
        await Like.findByIdAndDelete(tweetlike._id)

        return res
        .status(200)
        .json(new ApiResponse(200,"tweet unliked"))
    }else{
        const createtweet=await Like.create({
            tweet:tweetId,likedBy:req.user._id
        })

        return res
        .status(200)
        .json(new ApiResponse(200,"tweet liked"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const getvedios=await Like.find({
        likedBy:req.user._id
    }).populate("video")

    return res
    .status(200)
    .json(new ApiResponse(200,getvedios,"video fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}