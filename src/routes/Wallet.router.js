import { Router } from "express";
import {
  addBalance,
  addBalanceAndChangeDate,
  clearWallet,
  getWalletData,
  walletInit,
} from "../controllers/wallet.controller.js";
import { verifyJWT } from "../middlewear/auth.middlewear.js";

const router = Router();
router.use(verifyJWT);

router.route("/walletInit").post(walletInit);
router.route("/addBalance").post(addBalance);
router.route("/clearWallet").post(clearWallet);
router.route("/addBalanceAndChangeDate").post(addBalanceAndChangeDate);
router.route("/getWalletData").get(getWalletData);

export default router;
