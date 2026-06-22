import { Router } from "express"
import { proteger } from "../middlewares/authMiddleware.js"
import { soloAdmin } from "../middlewares/adminMiddleware.js"
import {
  listarUsuarios,
  cambiarEstadoUsuario,
  cambiarRolUsuario,
  listarRoles,
  listarEventosAdmin,
  crearEventoPublico,
  actualizarEvento,
  listarRecintosAdmin,
  crearRecinto,
  actualizarRecinto,
  listarServiciosAdmin,
  listarCategoriasServicio,
  crearServicio,
  actualizarServicio
} from "../controllers/adminController.js"

const router = Router()

// Todas las rutas de este archivo requieren estar logueado Y ser Administrador
router.use(proteger, soloAdmin)

// Usuarios
router.get("/usuarios", listarUsuarios)
router.put("/usuarios/:id/estado", cambiarEstadoUsuario)
router.put("/usuarios/:id/rol", cambiarRolUsuario)
router.get("/roles", listarRoles)

// Eventos
router.get("/eventos", listarEventosAdmin)
router.post("/eventos", crearEventoPublico)
router.put("/eventos/:id", actualizarEvento)

// Recintos
router.get("/recintos", listarRecintosAdmin)
router.post("/recintos", crearRecinto)
router.put("/recintos/:id", actualizarRecinto)

// Servicios
router.get("/servicios", listarServiciosAdmin)
router.get("/categorias-servicio", listarCategoriasServicio)
router.post("/servicios", crearServicio)
router.put("/servicios/:id", actualizarServicio)

export default router
