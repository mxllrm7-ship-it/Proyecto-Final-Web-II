import { Router } from "express"
import { obtenerCiudades } from "../controllers/CiudadController.js"

const router = Router()

router.get("/", obtenerCiudades)

export default router