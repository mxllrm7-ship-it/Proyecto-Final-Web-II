import contratarRecintoService from "../services/contratarRecintoService"

const contratarRecintoModel = async (
  id_recinto,
  nombre_reservante,
  fecha_inicio,
  fecha_fin,
  hora_inicio,
  hora_fin,
  token
) => {
  const response = await contratarRecintoService(
    id_recinto,
    nombre_reservante,
    fecha_inicio,
    fecha_fin,
    hora_inicio,
    hora_fin,
    token
  )

  return response.reserva
}

export default contratarRecintoModel