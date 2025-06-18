import { addStudent, loginStudent } from "../controllers/studentController.js";

import Router from "express"

const router = Router()

router.post("/loginstudent",loginStudent)
router.post("/addstudent" , addStudent)

export default router