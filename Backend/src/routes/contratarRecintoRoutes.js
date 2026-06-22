import { Router } from "express"
import { contratarRecinto } from "../controllers/contratarRecintoController.js"
import { proteger } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/", proteger, contratarRecinto)

export default router