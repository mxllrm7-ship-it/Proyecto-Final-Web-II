import { obtenerMisEventosModel } from "../models/ticketsUsuarioModel.js"

export const obtenerMisEventos = async (req, res) => {
  const id_usuario = req.usuario.id_usuario

  try {
    const tickets = await obtenerMisEventosModel(id_usuario)
    return res.status(200).json({ ok: true, tickets })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}