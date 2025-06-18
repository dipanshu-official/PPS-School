import Router from "express"
import { signupData , loginData , getCurrentUser } from "../controllers/userController.js"


const router = Router()

router.post('/login',loginData)
router.post('/signup',signupData)
router.post('/currentUser',getCurrentUser)




export default router
