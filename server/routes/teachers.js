import express from "express";
import {
  addTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  updateTeacherPassword,
  deleteTeacher,
  getTeachersByDepartment,
  searchTeachers
} from "../controllers/teacherController.js";
import { authenticate } from "../middleware/auth.js";

const  router = express.Router();

// Public routes
router.post("/register", addTeacher);
router.post("/login", loginTeacher);

// Protected routes (add authMiddleware if you have authentication middleware)
router.get("/teachers",authenticate, getAllTeachers);
router.get("/search", searchTeachers);
router.get("/department/:department", getTeachersByDepartment);
router.get("/:id", getTeacherById);
router.put("/:id", updateTeacher);
router.put("/:id/password", updateTeacherPassword);
router.delete("/deleteteacher/:id", deleteTeacher);


export default router;