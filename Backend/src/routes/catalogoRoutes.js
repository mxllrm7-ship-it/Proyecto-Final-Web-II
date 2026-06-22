import { Router } from "express"
import {
  obtenerCatalogo,
  buscarEventosPorNombre,
  obtenerCategorias,
  obtenerEventosPorCategoria
} from "../controllers/catalogoController.js"

const router = Router()

router.get("/", obtenerCatalogo)
router.get("/buscar", buscarEventosPorNombre)
router.get("/categorias", obtenerCategorias)
router.get("/categoria/:categoria", obtenerEventosPorCategoria)

export default router