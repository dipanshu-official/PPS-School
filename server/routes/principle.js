import Router from "express"
import { signupData , loginData } from "../controllers/principleController.js"

const router = Router()

router.post("/signup-principle",signupData)
router.post("/login-principle",loginData)



export default router