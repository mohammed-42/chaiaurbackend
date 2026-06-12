//require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
dotenv.config({
  path:'./.env'
})
import connectDB from "./db/index.js"



connectDB()


















/*(async () => {
  try{
     await mongoose.connect(`${process.env.MONGODB_URI}`);
     app.on("error",(error)=>{
      console.log("error:",(error));
      throw error;
     })
     app.listen(process.env.PORT, ()=>{
      console.log(`app is listening on port ${process.env.PORT}`)
     })
  }catch{
    console.log("error occurred while connecting",error);
    throw err;
  }
});
*/

