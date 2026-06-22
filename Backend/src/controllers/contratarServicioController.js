import { contratarServicioModel } from "../models/contratarServicioModel.js"

export const contratarServicio = async (req, res) => {
  const { id_evento, id_servicio, cantidad } = req.body

  if (!id_evento || !id_servicio) {
    return res.status(400).json({ ok: false, mensaje: "id_evento e id_servicio son obligatorios." })
  }

  try {
    const resultado = await contratarServicioModel({ id_evento, id_servicio, cantidad })

    if (!resultado.ok) {
      return res.status(409).json({ ok: false, mensaje: resultado.mensaje })
    }

    return res.status(201).json({ ok: true, mensaje: resultado.mensaje })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}