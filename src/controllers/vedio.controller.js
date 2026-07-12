import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { vedio } from "../models/vedio.model.js"
import {loginUser} from "../controllers/user.controller.js"

const vedioupload = asynchandler(async(req,res)=>{
  if(!loginUser){
    throw new ApiError(400,"please login before uploading vedio")
  }
  
})


//first user should be loggedin
//if user click upload then upload the vedio
//upload vedios and related fields
