import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const vedioSchema=new mongoose({
  vedioFile:{
    type:String,
    required:true
  },
  thumbnail:{
   type:String,
   required:true
  },
  title:{
   type:String,
   required:true
  },
  description:{
   type:String,
   required:true
  },
  duration:{
   type:Number,
   required:true
  },
  views:{
    type:Number,
    default:0
  },
  isPublished:{
    type:boolean,
    default:true
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"

  }
},{timeStamps})
vedioSchema.plugin(mongooseAggrigatePaginate);
export const vedio=mongoose.model("vedio",vedioSchema);