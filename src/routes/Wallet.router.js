import { Router } from "express";
import { addBalance, walletInit } from "../controllers/wallet.controller.js";
import { verifyJWT } from "../middlewear/auth.middlewear.js";

const router = Router();

router.route("/walletInit").post( verifyJWT, walletInit)
router.route("/addBalance").post( verifyJWT, addBalance)

export default router