import { Router } from "express";

const router = Router();

router.get("/group/:groupId");
router.get("/:id");
router.put("/:id");
router.delete("/:id");

export default router;
