
import { User } from "../models/User.model.js";
import { Wallet }  from "../models/Wallet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";


const options = {
    httpOnly: true,           
    secure: true,
}

const generateAccessAndRefreshToken = async (_id) => {
    try {
        const user = await User.findById(_id);
        if(!user){
            throw new ApiError(500, "Cannot generate access and refresh token !")
        }
    
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
    
        if(!accessToken || !refreshToken){
            throw new ApiError(500, "Cannot generate access and refresh token !!")
        }
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
    
    
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }

}

const createWallet = async (userID) => {
    
    try {
        const walletExist = await Wallet.findOne({userID:userID})
        if(walletExist){
            throw new ApiError(400, "Wallet alredy Exist!")
        }
    
        const wallet = await Wallet.create({
            totalBalance: 0,
            goalDate: null,
            userID,
        })
    
        if (!wallet) {
            throw new ApiError(400, "Wallet not initialized!");
        }
    
        return wallet;
    } catch (error) {
        console.log("Error: ",error)
    }

}

const registerUser = asyncHandler(async (req, res) => {
    console.log("register route HIT!!");
    
    console.log("req.body", req.body);

    // get data from frontend
    const {userName, email, password} = req.body

    // verify if all require fields are given

    if(!userName || !email || !password ){
        throw new ApiError(400, "Input not given properly!")
    }

    //check if user alredy exist

    const existedUser = await User.findOne({email})
    if(existedUser){
        throw new ApiError(400, "user alredy exist")
    }

    // push to database
    const user = await User.create({
        userName: userName.toLowerCase() ,
        email,
        password,
    })

    // retrive data - pass

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    //check for user creation

    if(!createdUser){
        throw new ApiError(501, "user not created!")
    }

    // create wallet

    const userID = createdUser._id

    const wallet = await createWallet(userID)


    // return response
    return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "user created succesfully")
    ) 
})

const loginUser = asyncHandler( async (req,res) => {

    //get user data
    const{email , password } = req.body
    
    //check if fields are given 
    if(!email){
        throw new ApiError(400, "Email is not provided!!")
    }else if(!password){
        throw new ApiError(400, "Password is not provided!!")
    }

    // find user
    const user = await User.findOne({email});

    // check if user exist
    if(!user){
        throw new ApiError(400, "Invalid email !!")
    }

    //compair password 
    const isValidPass = await user.comparePassword(password);
    if(!isValidPass){
        throw new ApiError(400, "Wrong password!")
    }

    const {accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken,
            },
            "User logged in Successfully"
        )
    )

    

})

const logoutUser = asyncHandler( asyncHandler( async (req, res) => {
    const userID = req.user._id;

    await User.findByIdAndUpdate(userID,{ $set: {refreshToken: undefined}},{new: true})

    return res
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User Logout!"
        )
    )
}))

const refreshAccessToken = asyncHandler( async (req, res) => {
    // get refresh token
    const incomingRefreshToken = req.cookies.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(400, "Unauthorised access!")
    }
    // verify token and get user
    const decodedToken = User.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password")

    if(!user){
        throw new ApiError(401, "Invalid refresh token")
    }

    // compare users refresh token with cookie token
    if(user?.refreshToken !== incomingRefreshToken){
        throw new ApiError(400, "Invalid RefreshToken ")
    }
    // generate refresh and accesstoken
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
    // response
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new Response(
            200,
            {
                accessToken,
                refreshToken:newRefreshToken,
            },
            "Access token refreshed!!"
        )
    )

})

export {registerUser,loginUser, logoutUser,refreshAccessToken}
