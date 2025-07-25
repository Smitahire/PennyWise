import mongoose from "mongoose";
import { User } from "./User.model.js";
import { Wallet } from "./Wallet.model.js";

const expenseSchema = mongoose.Schema(
    {
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            require: true,
        },
        walletID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Wallet
        },
        title: {
            type: String,
            require: true,
        },
        category:{
            type:String,
            enums: ['food', 'fun', 'travel', 'study', 'bill', 'not-known'],
            default: 'not-known',
        },
        note: {
            type: String,
        },
        amount: {
            type: Number,
            require: true,
        },
        date: {
            type: date,
            require: true,
        }
    }
)


export const Expense = mongoose.model("Expense", expenseSchema)