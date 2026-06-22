// Debe usarse SIEMPRE después de "proteger" (authMiddleware), ya que depende
// de req.usuario, que ese middleware deja listo desde el token.
export const soloAdmin = (req, res, next) => {
  const rol = (req.usuario?.nombre_rol || "").trim().toLowerCase()

  if (rol !== "administrador") {
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permisos de administrador para esta acción."
    })
  }

  next()
}
