import {
  listarNotificacionesModel,
  contarNoLeidasModel,
  marcarLeidaModel,
  marcarTodasLeidasModel
} from "../models/notificacionModel.js"

const manejarError = (res, error) => {
  return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
}

export const listarNotificaciones = async (req, res) => {
  try {
    const notificaciones = await listarNotificacionesModel(req.usuario.id_usuario)
    const noLeidas = await contarNoLeidasModel(req.usuario.id_usuario)
    return res.status(200).json({ ok: true, notificaciones, noLeidas })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const marcarLeida = async (req, res) => {
  const id_notificacion = parseInt(req.params.id)
  try {
    const notificacion = await marcarLeidaModel(id_notificacion, req.usuario.id_usuario)
    return res.status(200).json({ ok: true, notificacion })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const marcarTodasLeidas = async (req, res) => {
  try {
    await marcarTodasLeidasModel(req.usuario.id_usuario)
    return res.status(200).json({ ok: true })
  } catch (error) {
    return manejarError(res, error)
  }
}
