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

// ─── Usuarios ───────────────────────────────────────────────────────────────

export const adminListarUsuarios = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/usuarios`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.usuarios
}

export const adminCambiarEstadoUsuario = async (id_usuario, estado_usuario, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/usuarios/${id_usuario}/estado`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ estado_usuario })
  })
  const data = await manejarRespuesta(res)
  return data.usuario
}

export const adminCambiarRolUsuario = async (id_usuario, id_rol, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/usuarios/${id_usuario}/rol`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ id_rol })
  })
  const data = await manejarRespuesta(res)
  return data.usuario
}

export const adminListarRoles = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/roles`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.roles
}

// ─── Eventos ────────────────────────────────────────────────────────────────

export const adminListarEventos = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/eventos`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.eventos
}

export const adminActualizarEvento = async (id_evento, cambios, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/eventos/${id_evento}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(cambios)
  })
  const data = await manejarRespuesta(res)
  return data.evento
}

export const adminCrearEventoPublico = async (evento, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/eventos`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(evento)
  })
  const data = await manejarRespuesta(res)
  return data.evento
}

// ─── Recintos ───────────────────────────────────────────────────────────────

export const adminListarRecintos = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/recintos`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.recintos
}

export const adminCrearRecinto = async (recinto, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/recintos`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(recinto)
  })
  const data = await manejarRespuesta(res)
  return data.recinto
}

export const adminActualizarRecinto = async (id_recinto, cambios, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/recintos/${id_recinto}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(cambios)
  })
  const data = await manejarRespuesta(res)
  return data.recinto
}

// ─── Servicios ──────────────────────────────────────────────────────────────

export const adminListarServicios = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/servicios`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.servicios
}

export const adminListarCategoriasServicio = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/categorias-servicio`, { headers: authHeaders(token) })
  const data = await manejarRespuesta(res)
  return data.categorias
}

export const adminCrearServicio = async (servicio, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/servicios`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(servicio)
  })
  const data = await manejarRespuesta(res)
  return data.servicio
}

export const adminActualizarServicio = async (id_servicio, cambios, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/servicios/${id_servicio}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(cambios)
  })
  const data = await manejarRespuesta(res)
  return data.servicio
}

// ─── Ciudades (reutiliza endpoint público ya existente) ─────────────────────

export const adminListarCiudades = async () => {
  const res = await fetch(`${BASE_URL}/api/ciudad`)
  const data = await manejarRespuesta(res)
  return data.ciudades
}
