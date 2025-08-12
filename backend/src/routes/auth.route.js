import express from "express";
import {
  login,
  logout,
  signup,
  checkAuth,
  updateprofile,
  verifyEmail, 
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/verify-email", verifyEmail)

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateprofile);
router.get("/check", protectRoute, checkAuth);

export default router;
