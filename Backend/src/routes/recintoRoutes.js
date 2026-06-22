import { Router } from "express"
import { obtenerCatalogoRecintos } from "../controllers/recintoController.js"

const router = Router()

router.get("/catalogo", obtenerCatalogoRecintos)

export default router