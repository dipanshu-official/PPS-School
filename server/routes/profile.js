import express from "express";

import { authenticate } from "../middleware/auth.js";
import { getUserProfile } from "../controllers/profile.js";

const  router = express.Router();

// Public routes
router.get("/profile", authenticate,getUserProfile);


export default router
