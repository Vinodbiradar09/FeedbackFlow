import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const generateAccessAndRefreshTokens = async (userId)=>{
    if(!userId){
        throw new ApiError(401 , "There is no userId for generating the tokens");
    }

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(401 , "User not found while generating the tokens");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    if(! accessToken && !refreshToken){
        throw new ApiError(402 , "failed to generate the tokens");
    }
    user.refreshTokens = refreshToken;
    await user.save();
    return {accessToken , refreshToken};
}

const registerUser = asyncHandler(async (req, res) => {
    // get the details from body , check it 
    // based on the email check the user exist or not 
    // if exists throw error , if not create a new user
    // validate the email make sure to match the regex
    // validate the password make sure , it is not less than six chars 
    // make sure the user profile is came or not , and upload to the cloudinary
    // check if the new user is created or not 
    // send the res

    const { email, password, name, role } = req.body;

    if ([email, password, name, role].map((field) => field?.trim() === "")) {
        throw new ApiError(403, "All the fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(402, "User with email already exists can't create new one");
    }

    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!regex.test(email)) {
        throw new ApiError(403, "Invalid email format please provide valid email ");
    }

    if(password.length < 6){
        throw new ApiError(403 , "Password must be Six Chars");
    }

    const userProfile = req.file?.path;

    if(!userProfile){
        throw new ApiError(404 , "User profile is missing");
    }

    const profile = await uploadOnCloudinary(userProfile);

    if(!profile){
        throw new ApiError(404 , "failed to upload on the cloudinary");
    };


    const user = await User.create({
        name,
        email,
        password,
        role,
        userProfile : profile.secure_url,
        isActive : true,
        lastLogin : Date.now(),

    })

    if(!user){
        throw new ApiError(404 , "failed to create new user");
    }

    res.status(200).json(new ApiResponse(200 , user , "user created successfully"));

})

const loginUser = asyncHandler(async (req, res) => {
    // get the details from body and check it 
    // check the email regex , validate it 
    // find the user based on the email , check if the user is found or not 
    // check for the password it must 6 chars , and compare the password 
    // if the password is correct , then generate tokens 
    // store the tokens in the cookies and send res

    const {email , password} = req.body;

    if(! email && ! password){
        throw new ApiError(403 , "email and password fields are required");
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404 , "User not exists please register the user first");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(403 , "Invalid password or email please check");
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);

    if(! accessToken && !refreshToken){
        throw new ApiError(402 , "No tokens are generated");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshTokens");
    if(!loggedInUser){
        throw new ApiError(403 , "There is no loggedIn user");
    }

    res.status(200).cookie("accessToken" , accessToken).cookie("refreshToken" , refreshToken).json(new ApiResponse(200 , {user : loggedInUser , accessToken , refreshToken} , "Successfully loggedIn user"));
})

const logoutUser = asyncHandler(async (req, res) => {
    // from the req take the user , query to db check if the user exists or not 
    // if the user exists make sure remove his refresh token from db 
    // clear the cookie from browser and send the empty user
})

const refreshAccessToken = asyncHandler(async (req, res) => {

})

const forgetPassword = asyncHandler(async (req, res) => {
    // take the user email from the frontend , check if the email exist or not , if exists 
    // generate the tokens , now validate the tokens sent in the url and users tokens , if they matched then only we will show the retyping for the new password ,
    // ask user to type the new password , check the password validity 
    // overwrite the existing password with the new password 
    // and save it in db 
})

const resetPassword = asyncHandler(async (req, res) => {
    // take the oldPassword and newPassword from the body , check it 
    // oldPassword compare with the loggedIn user , by accessing it through the req.user , 
    // check the user is existed or not from this user take the password and take the oldpassword compare it 
    // if the oldPassword matched then overwritte with new password 
    // send the res
})

