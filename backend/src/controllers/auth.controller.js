import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
// NOTE: ensure `generateToken` is available in this module's scope
// (e.g., import it from a utility like "../lib/auth.js"). It is used below
// to issue an auth token (typically a JWT) after successful signup.
// signup controller
export const signup=async(req,res)=>{
   // Extract required fields from request body
   const {fullName,email,password}=req.body;

   try{
      // Basic validation: require name, email, and password
        if(!fullName || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
           // Enforce a minimum password length for security
           if(password.length<6){
            return res.status(400).json({
                message:"Password must be at least 6 characters long"
            });
           }
        
           // Simple email format check (client-side should also validate)
           const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if(!emailRegex.test(email)){
            return res.status(400).json({
                message:"Please enter a valid email"
            });
           }

           // Uniqueness check: prevent duplicate registrations by email
        const usermail=await User.findOne({email});
        if(usermail){
            return res.status(400).json({
                message:"Email already exists"
            });
        }


        // Hash the password before storing it in the database.
        // `genSalt(10)` uses 10 rounds; increase for stronger hashing,
        // balancing security and performance.
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        // Create a new user document (not yet persisted)
        const newUser=new User({
            fullName,
            email,
            password:hashedPassword
        });

       if(newUser){
        // Issue an auth token for the newly created user.
        // Common implementation sets an httpOnly cookie on the response.
       
        // Persist the user to the database first then issue auth cookie
        const saveduser=await newUser.save();
        generateToken(saveduser._id,res);
        // Respond with created status and non-sensitive user details
        res.status(201).json({
            id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            message:"User registered successfully"   
        })
       }
       else{
        // This branch is unlikely since `new User(...)` returns an object.
        // Real failures are handled by the catch block below.
        return res.status(400).json({
            message:"Invalid user data"
        });
       }
   }
   catch(e){
      // Log error and return a generic server error to the client
      console.log(e);
      res.status(500).json({
         message:"Internal server error"
      });
   }
}