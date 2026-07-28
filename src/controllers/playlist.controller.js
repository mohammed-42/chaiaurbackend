import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"


const createPlaylist = asynchandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name){
        throw new ApiError(400,"no name found")
    }
    const playlist=await Playlist.create({
        name:name,
        description:description || "",
        videos:[],
        owner:req.user_id
    })
    if(!playlist){
        throw new ApiError(500, "something went wrong while creating playlist")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"play list created successfully"))
})

const getUserPlaylists = asynchandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!userId){
        throw new ApiError(400,"no user found")
    }
    const getplaylist=await Playlist.find({owner:userId})
    if(!getplaylist){
        throw new ApiError(500,"something went wrong")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"user playlist fetched successfully"))
})

const getPlaylistById = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(404,"enter a play list")
    }
    const getplaylist=await Playlist.findById(playlistId)
    if(!getplaylist){
        throw new ApiError(500,"some thing went wrong")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"user playlist fetched successfully"))
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"enter a play list name")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"enter a vedio to update")
    }
    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
         throw new ApiError(404,"something went wrong")
    }
    if(Playlist.owner.toString()!==req.user._id){
         throw new ApiError(400,"only specified user can update a playlist")
    }
    const updateplaylistvideo=await Playlist.findByIdAndUpdate(
        playlistId,
        {
             $addToSet:{videos:videoId}
        },{new:true}
    ) 

})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "invalid playlist id")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "you are not allowed to edit this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))
})

const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "you are not allowed to delete this playlist")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"))
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "invalid playlist id")
    }

    if(!name){
        throw new ApiError(400, "name is required")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "you are not allowed to edit this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}