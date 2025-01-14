import express from "express"
import {changePassword, loginUser, registerUser} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/changePassword", changePassword)

export default userRouter; 