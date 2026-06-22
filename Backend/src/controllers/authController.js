import { loginModel } from "../models/authModel.js"
import { generarToken } from "../config/jwt.js"

export const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ ok: false, mensaje: "Username y password son obligatorios." })
  }

  try {
    const usuario = await loginModel({ username, password })

    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: "Credenciales inválidas." })
    }

    if (usuario.estado_usuario?.trim().toLowerCase() !== "activo") {
      return res.status(403).json({ ok: false, mensaje: "Usuario inactivo. Contacte al administrador." })
    }

    const token = generarToken({
      id_usuario: usuario.id_usuario,
      id_rol: usuario.id_rol,
      nombre_rol: usuario.nombre_rol,
      username: usuario.username
    })

    return res.status(200).json({ ok: true, token, usuario })
  } catch (error) {
    if (error.message?.includes("Usuario no encontrado")) {
      return res.status(404).json({ ok: false, mensaje: error.message })
    }
    if (error.message?.includes("Contraseña incorrecta")) {
      return res.status(401).json({ ok: false, mensaje: error.message })
    }
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}