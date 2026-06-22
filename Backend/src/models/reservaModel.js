import { supabase } from "../config/supabase.js"

// Eventos privados donde el usuario aparece como organizador, o que están
// ligados a él vía una orden (ej. lo reservó un administrador desde
// escritorio buscando al cliente). Mismo criterio que usa la app móvil.
export const listarMisReservasRecintoModel = async (id_usuario) => {
  const { data: comoOrganizador, error: errorOrg } = await supabase
    .from("evento")
    .select(`
      id_evento, nombre_evento, estado_evento, categoria, imagen_url, nombre_reservante,
      id_recinto, recinto ( nombre_recinto, direccion_recinto ),
      fecha_evento ( fecha_inicio, fecha_fin, hora_inicio, hora_fin )
    `)
    .eq("id_organizador", id_usuario)
    .eq("es_publico", false)

  if (errorOrg) throw errorOrg

  const { data: ordenes, error: errorOrdenes } = await supabase
    .from("orden")
    .select("id_evento")
    .eq("id_usuario", id_usuario)

  if (errorOrdenes) throw errorOrdenes

  const idsPorOrden = [...new Set((ordenes || []).map(o => o.id_evento).filter(Boolean))]

  let porOrden = []
  if (idsPorOrden.length > 0) {
    const { data, error } = await supabase
      .from("evento")
      .select(`
        id_evento, nombre_evento, estado_evento, categoria, imagen_url, nombre_reservante,
        id_recinto, recinto ( nombre_recinto, direccion_recinto ),
        fecha_evento ( fecha_inicio, fecha_fin, hora_inicio, hora_fin )
      `)
      .in("id_evento", idsPorOrden)
      .eq("es_publico", false)
    if (error) throw error
    porOrden = data || []
  }

  const todos = [...comoOrganizador, ...porOrden]
  const sinDuplicados = Array.from(new Map(todos.map(ev => [ev.id_evento, ev])).values())

  // Enriquecer con saldo pendiente (id_orden, monto_total, pagado, saldo)
  const idsEvento = sinDuplicados.map(ev => ev.id_evento)
  if (idsEvento.length > 0) {
    const { data: ordenesDeEstos } = await supabase
      .from("orden")
      .select("id_orden, id_evento, monto_total")
      .in("id_evento", idsEvento)

    const idsOrden = (ordenesDeEstos || []).map(o => o.id_orden)
    let pagosPorOrden = {}
    if (idsOrden.length > 0) {
      const { data: pagos } = await supabase
        .from("pago")
        .select("id_orden, monto_pago")
        .in("id_orden", idsOrden)
      for (const p of pagos || []) {
        pagosPorOrden[p.id_orden] = (pagosPorOrden[p.id_orden] || 0) + Number(p.monto_pago || 0)
      }
    }

    for (const ev of sinDuplicados) {
      const orden = (ordenesDeEstos || []).find(o => o.id_evento === ev.id_evento)
      if (orden) {
        const pagado = pagosPorOrden[orden.id_orden] || 0
        ev.id_orden = orden.id_orden
        ev.monto_total = orden.monto_total
        ev.monto_pagado = pagado
        ev.saldo_pendiente = Math.max(0, Number(orden.monto_total || 0) - pagado)
      }
    }
  }

  return sinDuplicados.sort((a, b) => b.id_evento - a.id_evento)
}

// Igual que arriba, pero solo eventos "activos" (no cancelados/finalizados) y
// que sean eventos reales (no reservas de solo-recinto, que se guardan con
// categoria "Personal") — para el selector de "Contratar servicio".
export const listarMisEventosActivosModel = async (id_usuario) => {
  const todos = await listarMisReservasRecintoModel(id_usuario)
  return todos.filter(
    ev =>
      !["cancelado", "finalizado"].includes((ev.estado_evento || "").trim().toLowerCase())
      && (ev.categoria || "").trim().toLowerCase() !== "personal"
  )
}
