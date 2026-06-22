import { Router } from "express"
import { crearCliente, editarPerfil } from "../controllers/usuarioController.js"
import { proteger } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/registro", crearCliente)
router.put("/perfil", proteger, editarPerfil)

export default router