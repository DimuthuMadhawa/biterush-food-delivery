import express from "express";
import { loginUser, registerUser, googleLoginUser, getUserProfile, adminLogin } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLoginUser);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.post("/admin-login", adminLogin);

export default userRouter;
