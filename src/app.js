import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRouter from "./routes/User.router.js"
import walletRouter from "./routes/Wallet.router.js"
import expenseRouter from "./routes/Expense.router.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/wallet", walletRouter)
app.use("/expense", expenseRouter)


export { app }