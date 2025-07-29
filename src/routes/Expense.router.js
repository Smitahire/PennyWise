import { Router } from "express";

import { verifyJWT } from "../middlewear/auth.middlewear.js";
import { createExpense } from "../controllers/Expense.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/createExpense").post(createExpense);


export default router;