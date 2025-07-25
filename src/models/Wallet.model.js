import mongoose from "mongoose";
import { User } from "./User.model.js";

const walletSchema = mongoose.Schema(
    {
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            require: true,
        },
        totalBalance: {
            type: Number,
            require:true,
        },
        remainingBalance:{
            type: Number,
        },
        goalDate: {
            type: Date,
        },
        dailyLimit:{
            type:Number,
        }
    }
)

walletSchema.pre('save', function (next) {
    if(this.isNew && this.remainingBalance == null) {
        this.remainingBalance = this.totalBalance;
    }

    if (this.isModified("remainingBalance") || this.isModified("goalDate") ){
        if (this.goalDate != null) {
            const today = new Date();
            const daysRemaining = Math.ceil((this.goalDate - today) / (1000 * 60 * 60 * 24));
            if (daysRemaining > 0) {
                this.dailyLimit = this.remainingBalance / daysRemaining;
            } else {
                this.dailyLimit = 0;  
            }
        }
    }
    next()
})



export const Wallet = mongoose.model("Wallet", walletSchema)