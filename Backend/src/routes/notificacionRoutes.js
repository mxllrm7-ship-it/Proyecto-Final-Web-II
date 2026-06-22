import { Router } from "express"
import { proteger } from "../middlewares/authMiddleware.js"
import { listarNotificaciones, marcarLeida, marcarTodasLeidas } from "../controllers/notificacionController.js"

const router = Router()

router.use(proteger)

router.get("/", listarNotificaciones)
router.put("/:id/leida", marcarLeida)
router.put("/leer-todas", marcarTodasLeidas)

export default router
