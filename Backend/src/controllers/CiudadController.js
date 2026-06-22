import { obtenerCiudadesModel } from "../models/Ciudad.js"

export const obtenerCiudades = async (req, res) => {
  try {
    const ciudades = await obtenerCiudadesModel()
    return res.status(200).json({ ok: true, ciudades })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor.",
      detalle: error.message
    })
  }
}