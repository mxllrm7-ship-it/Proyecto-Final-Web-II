import {
  obtenerCatalogoModel,
  buscarEventosPorNombreModel,
  obtenerCategoriasModel,
  obtenerEventosPorCategoriaModel
} from "../models/catalogoModel.js"

export const obtenerCatalogo = async (req, res) => {
  try {
    const eventos = await obtenerCatalogoModel()
    return res.status(200).json({ ok: true, eventos })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}

export const buscarEventosPorNombre = async (req, res) => {
  const { nombre } = req.query

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ ok: false, mensaje: "El parámetro 'nombre' es obligatorio." })
  }

  try {
    const eventos = await buscarEventosPorNombreModel(nombre.trim())
    return res.status(200).json({ ok: true, eventos })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}

export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await obtenerCategoriasModel()
    return res.status(200).json({ ok: true, categorias })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}

export const obtenerEventosPorCategoria = async (req, res) => {
  const { categoria } = req.params

  if (!categoria || categoria.trim() === "") {
    return res.status(400).json({ ok: false, mensaje: "La categoría es obligatoria." })
  }

  try {
    const eventos = await obtenerEventosPorCategoriaModel(decodeURIComponent(categoria))
    return res.status(200).json({ ok: true, eventos })
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}