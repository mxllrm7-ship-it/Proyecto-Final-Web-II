import MisTicketsModel from "../models/MisTicketsModel"

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/mis-eventos`

export const obtenerMisTickets = async () => {
  const token = localStorage.getItem("token")

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.mensaje || "Error al obtener tickets")
  }

  return new MisTicketsModel(result.tickets)
}