import {Expense} from '../models/Expense.model.js';
import { Wallet } from '../models/Wallet.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createExpense = asyncHandler(async (req, res)=> {
    const { title, category, note, amount} = req.body
    const parsedAmount = Number(amount)

    if(!title || !parsedAmount || isNaN(parsedAmount)){
        throw new ApiError(400, "Incomplete response, Enter all fields!")
    }

    const userID = req.user._id

    const wallet = await Wallet.findOne({userID:userID})

    if(wallet){
        throw new ApiError(404, "Wallet not found!")
    }

    const walletID = wallet._id

    if(parsedAmount > wallet.remainingBalance){
        throw new ApiError(400, "Not enough balance!")
    }

    // update expense in wallet 
    wallet.remainingBalance -= parsedAmount
    await wallet.save({validateBeforeSave: false})

    const expense_obj = {
        title,
        category,
        note,
        amount: parsedAmount,
        userID,
        walletID,
    }

    const expense = await Expense.create(expense_obj)

    if(!expense){
        throw new ApiError(400, "expence not created!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            expense,
            "expense created sucessfully!"
        )
    )

    
})

const getExpenseHistory = asyncHandler(async (req, res) => {

    const userID = req.user._id
    const wallet = await Wallet.findOne({userID:userID})

    if(wallet){
        throw new ApiError(404, "Wallet not found!")
    }

    const walletID = wallet._id

    const expenses = await Expense.find({
        walletID
    })

    res.status(200).json(
        new ApiResponse(
            200,
            expenses,
            "all expenses!"
        )
    )
})

const deleteExpense = asyncHandler( async (req, res) => {
    
})

export {createExpense}