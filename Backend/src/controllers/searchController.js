import { buscarEventosPorNombreModel } from "../models/searchModel.js"

export const buscarEventosPorNombre = async (req, res) => {
  const { q } = req.query

  if (!q || q.trim() === "") {
    return res.status(400).json({ ok: false, mensaje: "El parámetro de búsqueda es obligatorio." })
  }

  try {
    const eventos = await buscarEventosPorNombreModel(q.trim())
    return res.status(200).json({ ok: true, eventos })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}