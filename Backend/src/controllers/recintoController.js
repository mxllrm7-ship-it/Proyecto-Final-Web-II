import { obtenerCatalogoRecintosModel } from "../models/recintoModel.js"

export const obtenerCatalogoRecintos = async (req, res) => {
  try {
    const recintos = await obtenerCatalogoRecintosModel()
    return res.status(200).json({ ok: true, recintos })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}