import { obtenerServiciosCatalogoModel } from "../models/servicioModel.js"

export const obtenerServiciosCatalogo = async (req, res) => {
  try {
    const servicios = await obtenerServiciosCatalogoModel()
    return res.status(200).json({ ok: true, servicios })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}