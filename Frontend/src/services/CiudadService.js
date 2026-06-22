import Ciudad from "../models/Ciudad"

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/ciudad`

export const obtenerCiudades = async () => {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("Error al obtener las ciudades")
  }

  const result = await response.json()

  return result.ciudades.map(ciudad => Ciudad.fromJson(ciudad))
}