import { Router } from "express";
import { addMember, createNewchatGroup, deleteChatGroup, getAllChatGroup, getChatGroup, updateChatGroup } from "../controllers/chatGroupContoller.js";

const router = Router()

router.get("/user/:userId",getAllChatGroup)
router.get("/:id" ,getChatGroup)
router.post("/create",createNewchatGroup )
router.put("/:id",updateChatGroup)
router.delete("/:id",deleteChatGroup)
router.post('/:id/members',addMember)
router.delete('/:id/members/:userId',deleteChatGroup)


export default router