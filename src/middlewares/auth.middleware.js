import {asynchandler} from "../utils/asynchandler";

export const veriftJWT= asynchandler(async(req,res,next)=>{
    const token=req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer","")

    if(!token){
      throw new ApiError(401,"unauthorized request")
    }

     
})