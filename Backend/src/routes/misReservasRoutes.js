import { Router } from "express"
import { proteger } from "../middlewares/authMiddleware.js"
import {
  listarMisReservasRecinto,
  listarMisEventosActivos,
  listarMisServiciosReservados,
  listarItemsDeServicio,
  crearServicioReservado,
  listarMetodosPago,
  pagarReserva
} from "../controllers/misReservasController.js"

const router = Router()

router.use(proteger)

router.get("/recintos", listarMisReservasRecinto)
router.get("/eventos-activos", listarMisEventosActivos)
router.get("/servicios", listarMisServiciosReservados)
router.get("/servicio-items/:id", listarItemsDeServicio)
router.post("/servicios", crearServicioReservado)
router.get("/metodos-pago", listarMetodosPago)
router.post("/pagar", pagarReserva)

export default router
