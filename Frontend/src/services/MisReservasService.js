const BASE_URL = import.meta.env.VITE_BACKEND_URL

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
})

const manejarRespuesta = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.mensaje ?? "Error en la solicitud.")
  return data
}

export const obtenerMisReservasRecinto = async (token) => {
  const res = await fetch(`${BASE_URL}/api/mis-reservas/recintos`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.reservas
}

export const obtenerMisEventosActivos = async (token) => {
  const res = await fetch(`${BASE_URL}/api/mis-reservas/eventos-activos`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.eventos
}

export const obtenerMisServiciosReservados = async (token) => {
  const res = await fetch(`${BASE_URL}/api/mis-reservas/servicios`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.servicios
}

export const reservarServicioSolo = async ({ id_servicio, id_detalle, cantidad, nota, id_evento }, token) => {
  const res = await fetch(`${BASE_URL}/api/mis-reservas/servicios`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ id_servicio, id_detalle, cantidad, nota, id_evento })
  })
  const data = await manejarRespuesta(res)
  return data
}

export const obtenerItemsDeServicio = async (id_servicio, token) => {
  const res = await fetch(`${BASE_URL}/api/mis-reservas/servicio-items/${id_servicio}`, {
    headers: authHeaders(token)
  })
  const data = await manejarRespuesta(res)
  return data.items
}

export const obtenerMetodosPago = async (token) => {
  const res = await fetch(`${BASE_URL}/api/mis-reservas/metodos-pago`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.metodos
}

export const pagarReserva = async ({ id_orden, tipo_pago, id_metodo_pago }, token) => {
  const res = await fetch(`${BASE_URL}/api/mis-reservas/pagar`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ id_orden, tipo_pago, id_metodo_pago })
  })
  return manejarRespuesta(res)
}
