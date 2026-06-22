import { obtenerEventosModel } from "../models/eventoModel.js"
import { obtenerDetalleEventoModel } from "../models/detalleEventoModel.js"

export const obtenerEventos = async (req, res) => {
  try {
    const eventos = await obtenerEventosModel()
    return res.status(200).json({ ok: true, eventos })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}

export const obtenerDetalleEvento = async (req, res) => {
  const id_evento = parseInt(req.params.id)

  if (isNaN(id_evento)) {
    return res.status(400).json({ ok: false, mensaje: "ID de evento inválido." })
  }

  try {
    const detalle = await obtenerDetalleEventoModel(id_evento)

    if (!detalle) {
      return res.status(404).json({ ok: false, mensaje: "Evento no encontrado." })
    }

    return res.status(200).json({ ok: true, detalle })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}