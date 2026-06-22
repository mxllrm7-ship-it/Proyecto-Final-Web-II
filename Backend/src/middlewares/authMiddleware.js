import { verificarToken } from "../config/jwt.js"

export const proteger = (req, res, next) => {
  const authHeader = req.headers["authorization"]

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, mensaje: "Token no proporcionado." })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = verificarToken(token)
    req.usuario = decoded
    next()
  } catch (error) {
    return res.status(401).json({ ok: false, mensaje: "Token inválido o expirado." })
  }
}