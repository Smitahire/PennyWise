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


// walletSchema.pre('findOneAndUpdate', async function (next) {
//     const update = this.getUpdate();
//     const userID = this.getQuery().userID;
//     const doc = await this.model.findOne({ userID });

//     if (!doc) return next();

//     const currentRemaining = doc.remainingBalance || 0;
//     const incRemaining = update?.$inc?.remainingBalance || 0;
//     const newRemaining = currentRemaining + incRemaining;

//     const rawGoalDate = update?.$set?.goalDate || doc.goalDate;
//     if (rawGoalDate) {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const goalDate = new Date(rawGoalDate);
//         goalDate.setHours(0, 0, 0, 0);

//         const daysRemaining = Math.ceil((goalDate - today) / (1000 * 60 * 60 * 24));
//         const dailyLimit = daysRemaining > 0 ? newRemaining / daysRemaining : 0;

//         update.$set ??= {};
//         update.$set.dailyLimit = dailyLimit;

//         this.setUpdate(update);
//     }

//     next();
// });



export const Wallet = mongoose.model("Wallet", walletSchema)