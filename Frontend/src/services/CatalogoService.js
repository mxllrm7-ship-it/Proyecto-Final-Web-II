import { EventoCatalogo, CategoriaEvento } from "../models/CatalogoModels"

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/catalogo`

export const obtenerCatalogoEventos = async () => {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error("Error al obtener catálogo de eventos")
    }

    const result = await response.json()

    return result.eventos.map(
      evento => new EventoCatalogo(evento)
    )
  } catch (error) {
    console.error("Error en obtenerCatalogoEventos:", error)
    throw error
  }
}

export const buscarEventosPorNombre = async (nombre) => {
  try {
    const response = await fetch(
      `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
    )

    if (!response.ok) {
      throw new Error("Error al buscar eventos")
    }

    const result = await response.json()

    return result.eventos.map(
      evento => new EventoCatalogo(evento)
    )
  } catch (error) {
    console.error("Error en buscarEventosPorNombre:", error)
    throw error
  }
}

export const obtenerCategoriasEventos = async () => {
  try {
    const response = await fetch(
      `${API_URL}/categorias`
    )

    if (!response.ok) {
      throw new Error("Error al obtener categorías")
    }

    const result = await response.json()

    return result.categorias.map(
      categoria => new CategoriaEvento(categoria)
    )
  } catch (error) {
    console.error("Error en obtenerCategoriasEventos:", error)
    throw error
  }
}

export const obtenerEventosPorCategoria = async (categoria) => {
  try {
    const response = await fetch(
      `${API_URL}/categoria/${encodeURIComponent(categoria)}`
    )

    if (!response.ok) {
      throw new Error("Error al obtener eventos por categoría")
    }

    const result = await response.json()

    return result.eventos.map(
      evento => new EventoCatalogo(evento)
    )
  } catch (error) {
    console.error("Error en obtenerEventosPorCategoria:", error)
    throw error
  }
}