import { Router } from "express"
import { buscarEventosPorNombre } from "../controllers/searchController.js"

const router = Router()

router.get("/", buscarEventosPorNombre)

export default router