import mongoose from "mongoose";
import { User } from "./User.model.js";
import { Wallet } from "./Wallet.model.js";

const budgetSchema = mongoose.Schema(
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
        category:{
            type: String,
            enums: ['food', 'fun', 'travel', 'study', 'bill', 'not-known'],
            require: true,
        },
        amountLimit: {
            type: Number,
            require: true,
        },
        endDate: {
            type: Date,
            require: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    }
)


export const Budget = mongoose.model("Budget", budgetSchema)