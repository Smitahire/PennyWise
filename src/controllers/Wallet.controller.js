import { Wallet } from "../models/Wallet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";


const walletInit = asyncHandler( async (req,res) => {
    // get data from req.body

    const {totalBalance, goalDate} = req.body
    goalDate.setHours(0, 0, 0, 0);
    if(!totalBalance || !goalDate){
        throw new ApiError(400, "Provide valid input !")
    }
    
    // get data about user from req.user through midddlewear(verifyJWT)
    const userID = req.user._id
    if(!userID){
        throw new ApiError(400, "user id not found!")
    }

    // one user can have only one wallet // no double userID
    const walletExist = await User.findOne(userID).select("-password")
    if(walletExist){
        throw new ApiError(400, "Wallet alredy Exist!")
    }

    // check if all required feilds are there // checked alredy

    // goaldate should be larger than today
    const nowDate = Date.now()
    if(goalDate > nowDate){
        throw new ApiError(400, "goal date should be larger than current date")
    }

    // create object and upload to database
    const wallet = await Wallet.create({
        totalBalance,
        goalDate,
        userID,
    })

    // get wallet object 
    const createdWallet = await Wallet.findById(wallet._id)

    // return all feilds
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdWallet,
            "Wallet created succesfully!"
        )
    )

})

const addBalance = asyncHandler( async (req,res) => {

    const amountToAdd = Number(req.body.amountToAdd)
    
    if (isNaN(amountToAdd)) {
        throw new ApiError(400, "Invalid amount");
    }
    

    const userID = req.user._id
    if(!userID){
        throw new ApiError(400, "user id not found!")
    }

    // const wallet = await Wallet.findOneAndUpdate({userID: userID}, 
    //     { $inc: { totalBalance : amountToAdd , remainingBalance: amountToAdd} }, { new: true, runValidators: true,
    // context: 'query'  } )

    const wallet = await Wallet.findOne({userID: userID})

    wallet.totalBalance += amountToAdd
    wallet.remainingBalance += amountToAdd

    await wallet.save({validateBeforeSave: false})

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            wallet,
            "Balance added sucessfully!"
        )
    )

})

const addBalanceAndChangeDate = asyncHandler( async (req, res) => {
    const amountToAdd= Number(req.body.amountToAdd)
    const date = new Date(req.body.date)
    date.setHours(0, 0, 0, 0);
    
    if (isNaN(amountToAdd)) {
        throw new ApiError(400, "Invalid amount");
    }
    if (isNaN(date.getTime())) {
        throw new ApiError(400, "Invalid date");
    }

    const userID = req.user._id
    if(!userID){
        throw new ApiError(400, "user id not found!")
    }

    const wallet = await Wallet.findOne({userID: userID})
    if(!wallet){
        throw new ApiError(400, "Wallet not found!")
    }

    wallet.totalBalance += amountToAdd
    wallet.remainingBalance += amountToAdd
    wallet.goalDate = date


    await wallet.save({ validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            wallet,
            "Balance added and date changed sucessfully!"
        )
    )

})

const clearWallet = asyncHandler( async (req,res) => {

    const userID = req.user._id
    if(!userID){
        throw new ApiError(400, "user id not found!")
    }

    const wallet = await Wallet.findOneAndUpdate({userID: userID}, 
        { $set: { totalBalance : 0 , remainingBalance: 0, goalDate: null, dailyLimit: 0 } }, { new: true, runValidators: true,
    context: 'query'  } )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            wallet,
            "wallet cleared sucessfully !"
        )
    )

})

const getWalletData = asyncHandler( async (req, res) => {
    const userID = req.user._id
    if(!userID){
        throw new ApiError(400, "user id not found!")
    }
    const wallet = await Wallet.findOne({userID: userID})
    if(!wallet){
        throw new ApiError(400, "Not able to fetch wallet!")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            wallet,
            "Retrived data !"
        )
    )
})





export { walletInit, addBalance, addBalanceAndChangeDate, clearWallet, getWalletData}