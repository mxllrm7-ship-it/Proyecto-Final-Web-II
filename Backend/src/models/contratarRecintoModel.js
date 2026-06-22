import { supabase } from "../config/supabase.js"

export const contratarRecintoModel = async ({
  id_recinto, nombre_reservante, fecha_inicio, fecha_fin, hora_inicio, hora_fin, id_usuario
}) => {
  // 1) Validar disponibilidad: revisar que no choque con otro evento/reserva
  //    activos en ese mismo recinto y horario (mismo criterio que usa el escritorio)
  const { data: eventosDelRecinto, error: errorEventos } = await supabase
    .from("evento")
    .select("id_evento, estado_evento, fecha_evento ( fecha_inicio, fecha_fin, hora_inicio, hora_fin )")
    .eq("id_recinto", id_recinto)
    .neq("estado_evento", "Cancelado")

  if (errorEventos) throw errorEventos

  const inicioSolicitado = new Date(`${fecha_inicio}T${hora_inicio}`)
  const finSolicitado = new Date(`${fecha_fin}T${hora_fin}`)

  const hayChoque = (eventosDelRecinto || []).some(ev => {
    const f = ev.fecha_evento
    if (!f) return false
    const ini = new Date(`${f.fecha_inicio}T${f.hora_inicio}`)
    const fin = new Date(`${f.fecha_fin}T${f.hora_fin}`)
    return ini < finSolicitado && fin > inicioSolicitado
  })

  if (hayChoque) {
    throw new Error("El recinto no está disponible en ese horario. Elige otra fecha u hora.")
  }

  // 2) Crear la fecha del evento
  const { data: fechaCreada, error: errorFecha } = await supabase
    .from("fecha_evento")
    .insert({ fecha_inicio, fecha_fin, hora_inicio, hora_fin })
    .select()
    .single()
  if (errorFecha) throw errorFecha

  // 2.1) Calcular el monto total a pagar: precio por hora del recinto x horas reservadas
  const { data: recintoInfo, error: errorRecinto } = await supabase
    .from("recinto")
    .select("precio_hora")
    .eq("id_recinto", id_recinto)
    .single()
  if (errorRecinto) throw errorRecinto

  const horas = Math.max(1, Math.round((finSolicitado - inicioSolicitado) / 3600000))
  const montoTotal = (recintoInfo.precio_hora || 0) * horas

  // 3) Crear el evento privado, ligado al usuario real que lo reserva
  const { data: eventoCreado, error: errorEvento } = await supabase
    .from("evento")
    .insert({
      nombre_evento: `Reserva de ${nombre_reservante}`,
      categoria: "Personal",
      id_recinto,
      id_organizador: id_usuario,
      fecha: fechaCreada.id,
      es_publico: false,
      estado_evento: "Programado",
      nombre_reservante
    })
    .select()
    .single()
  if (errorEvento) throw errorEvento

  // 4) Crear la orden ligada al usuario (para que aparezca en "Mis reservas")
  //    SIN cobrar todavía — queda "Reservado" hasta que el cliente pague
  //    (completo o adelanto del 15%) desde "Mis Reservas".
  const { data: ordenCreada, error: errorOrden } = await supabase
    .from("orden")
    .insert({
      id_usuario,
      id_evento: eventoCreado.id_evento,
      fecha_orden: new Date().toISOString(),
      estado_orden: "Reservado",
      descuento_orden: 0,
      comprador_nombre: nombre_reservante,
      monto_total: montoTotal
    })
    .select()
    .single()
  if (errorOrden) throw errorOrden

  return { ...eventoCreado, monto_total: montoTotal, id_orden: ordenCreada.id_orden }
}