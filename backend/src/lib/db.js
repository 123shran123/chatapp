import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB=async()=>{
try{
const connection=await mongoose.connect(process.env.MONGO_URI);
if(connection){
   console.log("database connected successfully");
}
else{
    res.status(500).json({
        message:"error occured"
    })
}

}
catch(e)
{
console.log(e);
}

}

export default connectDB;