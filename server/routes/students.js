import { addStudent, deleteStudent, getAllStudents, loginStudent } from "../controllers/studentController.js";

import Router from "express"
import { authenticate } from "../middleware/auth.js";

const router = Router()

router.post("/loginstudent",loginStudent)
router.post("/addstudent" , addStudent)
router.get("/allstudent" ,authenticate, getAllStudents)
router.delete("/deletestudent/:id",deleteStudent)

export default router