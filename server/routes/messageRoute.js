import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = Router();

router.post("/send/:id",authenticate , sendMessage)
router.get("/:id",authenticate ,getMessage)

export default router;
