import { Router } from "express";
import { addBalance, addBalanceAndChangeDate, clearWallet, walletInit } from "../controllers/wallet.controller.js";
import { verifyJWT } from "../middlewear/auth.middlewear.js";

const router = Router();

router.route("/walletInit").post( verifyJWT, walletInit)
router.route("/addBalance").post( verifyJWT, addBalance)
router.route("/clearWallet").post( verifyJWT, clearWallet)
router.route("/addBalanceAndChangeDate").post( verifyJWT, addBalanceAndChangeDate)

export default router