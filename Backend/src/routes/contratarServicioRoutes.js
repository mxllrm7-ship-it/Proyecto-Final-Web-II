import { Router } from "express"
import { contratarServicio } from "../controllers/contratarServicioController.js"
import { proteger } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/", proteger, contratarServicio)

export default router