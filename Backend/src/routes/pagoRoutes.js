import { Router } from "express"
import { realizarCompra } from "../controllers/clientePagoController.js"
import { proteger } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/comprar", proteger, realizarCompra)

export default router