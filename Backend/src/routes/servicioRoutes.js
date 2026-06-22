import { Router } from "express"
import { obtenerServiciosCatalogo } from "../controllers/servicioController.js"


const router = Router()

router.get("/catalogo", obtenerServiciosCatalogo)

export default router