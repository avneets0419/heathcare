import express from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { DashboardRepository } from "../services/dashboard.repository";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Dependency Injection
const repository = new DashboardRepository();
const controller = new DashboardController(repository);

router.get("/dashboard", authMiddleware, controller.getDashboard);

export default router;