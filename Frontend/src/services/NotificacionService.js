const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const obtenerNotificaciones = async (token) => {
  const res = await fetch(`${BASE_URL}/api/notificaciones`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.mensaje ?? "Error al obtener notificaciones.")
  return data
}

export const marcarNotificacionLeida = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/notificaciones/${id}/leida`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error("No se pudo marcar como leída.")
}

export const marcarTodasLeidas = async (token) => {
  const res = await fetch(`${BASE_URL}/api/notificaciones/leer-todas`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error("No se pudo actualizar.")
}
