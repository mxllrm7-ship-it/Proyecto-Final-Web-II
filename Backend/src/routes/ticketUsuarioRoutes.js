import { Router } from "express"
import { obtenerMisEventos } from "../controllers/ticketUsuarioController.js"
import { proteger } from "../middlewares/authMiddleware.js"

const router = Router()

router.get("/", proteger, obtenerMisEventos)

export default router