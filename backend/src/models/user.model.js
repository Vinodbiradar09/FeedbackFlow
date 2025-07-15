 import mongoose , {Schema , model} from "mongoose";
 import jwt from "jsonwebtoken";
 import bcrypt from "bcrypt";
 import dotenv from "dotenv";
 dotenv.config();


 const userSchema = new Schema(
     {
        email : {
            type : String,
            unique : true,
            lowercase : true,
            required : true,
            trim : true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
            index : true,
        },
        password : {
            type : String,
            required : [true , "password is required"],
            minlength : [6 , "Password must be atleast six chars"],
        },
        name : {
            type : String,
            required : [true , "Name is required"],
            trim : true,
            maxlength : [50, "Name can't exceed more than 50 chars"],
        },
        role : {
            type : String,
            required : true,
            enum : {
                values : ["manager" , "employee"],
                message : 'Role must eithere manager or employee',
            }
        },
        isActive : {
            type : Boolean,
            default : true,
        },
        lastLogin : {
            type : Date,
            default : null,
        }
     } , 
    {timestamps:true}
);

userSchema.index({ role : 1, isActive : 1});


const User = model("User" , userSchema);
export{User};