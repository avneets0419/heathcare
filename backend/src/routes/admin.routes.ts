import { Router } from "express";
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from "../controllers/adminDoctor.controller";
import { getDashboardStats, getTrafficData } from "../controllers/adminDashbaord.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

// ✅ PROTECT ALL ADMIN ROUTES
router.use(authMiddleware, roleMiddleware(["admin"]));

router.get("/dashboard", getDashboardStats);
router.get("/traffic", getTrafficData);
router.get("/doctors", getAllDoctors);
router.post("/doctors", createDoctor);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);

export const adminRouter = router;