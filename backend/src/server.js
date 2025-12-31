import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authroute from "./routes/auth.route.js";
import messageroute from "./routes/message.route.js";

const app=express();
const port=process.env.PORT || 3000;

// console.log(process.env.PORT);


// basic end points

app.use("/api/auth",authroute);
app.use("/api/messages",messageroute);

app.listen(port,()=>{
    console.log("Server is running on port 3000");
})