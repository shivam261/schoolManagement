import { Router } from "express";
import { isTeacher } from "../middlewares/isTeacher.middleware.js";
const router = Router();
router.route("/login").post();

export default router;
