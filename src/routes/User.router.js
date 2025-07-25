import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/User.controller.js";
import { verifyJWT } from "../middlewear/auth.middlewear.js";


const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)

export default router