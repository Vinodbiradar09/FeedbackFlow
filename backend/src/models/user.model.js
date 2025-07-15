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

userSchema.pre("save" , function(next){
  if(!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password , 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {_id : this._id , email : this.email} ,
         process.env.ACCESS_TOKEN_SECRET ,
         {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
        ) 
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}



const User = model("User" , userSchema);
export{User};