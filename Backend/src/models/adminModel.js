import { supabase } from "../config/supabase.js"

// ─── USUARIOS ───────────────────────────────────────────────────────────────

export const listarUsuariosModel = async () => {
  const { data, error } = await supabase
    .from("usuario")
    .select(`
      id_usuario, id_rol, nombre_usuario, correo, telefono, username,
      estado_usuario, foto_rostro,
      rol ( id_rol, nombre )
    `)
    .order("id_usuario", { ascending: false })

  if (error) throw error
  return data
}

export const cambiarEstadoUsuarioModel = async (id_usuario, estado_usuario) => {
  const { data, error } = await supabase
    .from("usuario")
    .update({ estado_usuario })
    .eq("id_usuario", id_usuario)
    .select()
    .single()

  if (error) throw error
  return data
}

export const cambiarRolUsuarioModel = async (id_usuario, id_rol) => {
  const { data, error } = await supabase
    .from("usuario")
    .update({ id_rol })
    .eq("id_usuario", id_usuario)
    .select()
    .single()

  if (error) throw error
  return data
}

export const listarRolesModel = async () => {
  const { data, error } = await supabase.from("rol").select("id_rol, nombre").order("id_rol")
  if (error) throw error
  return data
}

// ─── EVENTOS ────────────────────────────────────────────────────────────────

export const listarEventosAdminModel = async () => {
  // Promover automáticamente: si un evento público sigue "Próximo" pero su
  // fecha de inicio ya llegó, pasa a "Activo" (listo para vender boletos).
  const hoy = new Date().toISOString().slice(0, 10)

  const { data: proximos, error: errorProximos } = await supabase
    .from("evento")
    .select("id_evento, fecha_evento ( fecha_inicio )")
    .eq("estado_evento", "Próximo")
    .eq("es_publico", true)

  if (!errorProximos && proximos) {
    const idsAPromover = proximos
      .filter(ev => ev.fecha_evento && ev.fecha_evento.fecha_inicio <= hoy)
      .map(ev => ev.id_evento)

    if (idsAPromover.length > 0) {
      await supabase.from("evento").update({ estado_evento: "Activo" }).in("id_evento", idsAPromover)
    }
  }

  const { data, error } = await supabase
    .from("evento")
    .select(`
      id_evento, id_organizador, nombre_evento, categoria, estado_evento,
      nombre_reservante, es_publico, imagen_url, id_recinto,
      recinto ( nombre_recinto ),
      usuario ( nombre_usuario ),
      fecha_evento ( id, fecha_inicio, fecha_fin, hora_inicio, hora_fin )
    `)
    .order("id_evento", { ascending: false })

  if (error) throw error
  return data
}

export const crearEventoPublicoModel = async ({
  nombre_evento, categoria, id_recinto, id_organizador,
  fecha_inicio, fecha_fin, hora_inicio, hora_fin,
  imagen_url, galeria, tipos_boleto
}) => {
  // 1) Crear la fecha del evento
  const { data: fechaCreada, error: errorFecha } = await supabase
    .from("fecha_evento")
    .insert({ fecha_inicio, fecha_fin, hora_inicio, hora_fin })
    .select()
    .single()
  if (errorFecha) throw errorFecha

  const hoy = new Date().toISOString().slice(0, 10)
  const estado_evento = fecha_inicio > hoy ? "Próximo" : "Activo"

  // 2) Crear el evento, ligado a esa fecha
  const { data: eventoCreado, error: errorEvento } = await supabase
    .from("evento")
    .insert({
      nombre_evento,
      categoria,
      id_recinto,
      id_organizador,
      fecha: fechaCreada.id,
      es_publico: true,
      estado_evento,
      nombre_reservante: nombre_evento,
      imagen_url: imagen_url || null
    })
    .select()
    .single()
  if (errorEvento) throw errorEvento

  // 3) Crear los tipos de boleto
  if (Array.isArray(tipos_boleto) && tipos_boleto.length > 0) {
    const filas = tipos_boleto.map(t => ({
      id_evento: eventoCreado.id_evento,
      nombre_tipo: t.nombre_tipo,
      precio: t.precio,
      cantidad_total: t.cantidad_total,
      cantidad_disponible: t.cantidad_total
    }))
    const { error: errorTipos } = await supabase.from("tipo_boleto").insert(filas)
    if (errorTipos) throw errorTipos
  }

  // 4) Crear la galería de fotos del evento
  if (Array.isArray(galeria) && galeria.length > 0) {
    const filasMedia = galeria.map((url, i) => ({ id_evento: eventoCreado.id_evento, url, orden: i }))
    const { error: errorMedia } = await supabase.from("media").insert(filasMedia)
    if (errorMedia) throw errorMedia
  }

  return eventoCreado
}

export const actualizarEventoModel = async (id_evento, cambios) => {
  const { data, error } = await supabase
    .from("evento")
    .update(cambios)
    .eq("id_evento", id_evento)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── RECINTOS ───────────────────────────────────────────────────────────────

export const listarRecintosAdminModel = async () => {
  const { data, error } = await supabase
    .from("recinto")
    .select(`
      id_recinto, id_ciudad, nombre_recinto, direccion_recinto, tipo_recinto,
      descripcion_recinto, capacidad, estado_recinto, link_ubicacion,
      precio_hora, imagen_url, nota,
      ciudad ( nombre_ciudad )
    `)
    .order("id_recinto", { ascending: false })

  if (error) throw error
  return data
}

export const crearRecintoModel = async (recinto) => {
  const { data, error } = await supabase.from("recinto").insert(recinto).select().single()
  if (error) throw error
  return data
}

export const actualizarRecintoModel = async (id_recinto, cambios) => {
  const { data, error } = await supabase
    .from("recinto")
    .update(cambios)
    .eq("id_recinto", id_recinto)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── SERVICIOS ──────────────────────────────────────────────────────────────

export const listarServiciosAdminModel = async () => {
  const { data, error } = await supabase
    .from("servicio")
    .select(`
      id_servicio, nombre_servicio, estado, categoria,
      categoria_servicio ( id_categoria, nombre_categoria )
    `)
    .order("id_servicio", { ascending: false })

  if (error) throw error
  return data
}

export const listarCategoriasServicioModel = async () => {
  const { data, error } = await supabase
    .from("categoria_servicio")
    .select("id_categoria, nombre_categoria")
    .order("nombre_categoria")

  if (error) throw error
  return data
}

export const crearServicioModel = async (servicio) => {
  const { data, error } = await supabase.from("servicio").insert(servicio).select().single()
  if (error) throw error
  return data
}

export const actualizarServicioModel = async (id_servicio, cambios) => {
  const { data, error } = await supabase
    .from("servicio")
    .update(cambios)
    .eq("id_servicio", id_servicio)
    .select()
    .single()

  if (error) throw error
  return data
}
