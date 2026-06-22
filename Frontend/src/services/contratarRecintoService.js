const API_URL = `${import.meta.env.VITE_BACKEND_URL}`

const contratarRecintoService = async (
  id_recinto,
  nombre_reservante,
  fecha_inicio,
  fecha_fin,
  hora_inicio,
  hora_fin,
  token
) => {
  const response = await fetch(`${API_URL}/api/contratar-recinto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      id_recinto,
      nombre_reservante,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al contratar recinto")
  }

  return data
}

export default contratarRecintoService