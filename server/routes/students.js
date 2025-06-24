import { addStudent, deleteStudent, getAllStudents, getCurrentStudent, loginStudent } from "../controllers/studentController.js";

import Router from "express"
import { authenticate } from "../middleware/auth.js";

const router = Router()

router.post("/loginstudent",loginStudent)
router.post("/addstudent" , addStudent)
router.get("/allstudent" ,authenticate, getAllStudents)
router.delete("/deletestudent/:id",deleteStudent)
router.get("/currentstudent/:id" , getCurrentStudent)

export default router