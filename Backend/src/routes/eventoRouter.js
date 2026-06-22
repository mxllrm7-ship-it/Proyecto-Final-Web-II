import { Router } from "express"
import { obtenerEventos, obtenerDetalleEvento } from "../controllers/eventoController.js"

const router = Router()

router.get("/", obtenerEventos)
router.get("/:id", obtenerDetalleEvento)

export default router