import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    const {videoId} = req.params
    const {content} = req.body
    if(!content?.trim()){
        throw new ApiError(400, "Tweet content is required")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video id")
    }
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "video not found")
    }
    const tweet=await Tweet.create({
        content,
        owner:req.user._id
    })
    return res
    .status(200)
    .json(new ApiResponse(201, comment, "Comment added successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id")
    }

    const tweets = await Tweet.find({owner: userId}).sort({createdAt: -1})

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }
    
    if(!content?.trim()){
        throw new ApiError(400, "content is required")
    }
    
    const tweet = await Tweet.findById(commentId)
    
    if(!tweet){
        throw new ApiError(404, "tweet not found")
    }
    
    if(tweet.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "you are not allowed to edit this tweet")
    }
    
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: { content }
        },
        { new: true }
    )
    
    return res
   .status(200)
   .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    
        if(!isValidObjectId(tweetId)){
            throw new ApiError(400, "invalid tweet id")
        }
    
        const tweet = await Tweet.findById(commentId)
    
        if(!tweet){
            throw new ApiError(404, "tweet not found")
        }
    
        if(tweet.owner.toString() !== req.user?._id.toString()){
            throw new ApiError(403, "you are not allowed to delete this tweet")
        }
    
        await Tweet.findByIdAndDelete(tweetId)
    
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}