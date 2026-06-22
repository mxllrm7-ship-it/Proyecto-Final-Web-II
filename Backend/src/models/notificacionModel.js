import { supabase } from "../config/supabase.js"

export const listarNotificacionesModel = async (id_usuario) => {
  const { data, error } = await supabase
    .from("notificacion")
    .select("id_notificacion, mensaje, tipo_notificacion, fecha_envio, estado_notificacion")
    .eq("id_usuario", id_usuario)
    .order("fecha_envio", { ascending: false })
    .limit(30)

  if (error) throw error
  return data
}

export const contarNoLeidasModel = async (id_usuario) => {
  const { count, error } = await supabase
    .from("notificacion")
    .select("id_notificacion", { count: "exact", head: true })
    .eq("id_usuario", id_usuario)
    .eq("estado_notificacion", "No leida")

  if (error) throw error
  return count ?? 0
}

export const marcarLeidaModel = async (id_notificacion, id_usuario) => {
  const { data, error } = await supabase
    .from("notificacion")
    .update({ estado_notificacion: "Leida" })
    .eq("id_notificacion", id_notificacion)
    .eq("id_usuario", id_usuario) // nunca dejar marcar notificaciones ajenas
    .select()
    .single()

  if (error) throw error
  return data
}

export const marcarTodasLeidasModel = async (id_usuario) => {
  const { error } = await supabase
    .from("notificacion")
    .update({ estado_notificacion: "Leida" })
    .eq("id_usuario", id_usuario)
    .eq("estado_notificacion", "No leida")

  if (error) throw error
}

export const crearNotificacionModel = async ({ id_usuario, mensaje, tipo_notificacion }) => {
  const { error } = await supabase.from("notificacion").insert({
    id_usuario,
    mensaje,
    tipo_notificacion,
    fecha_envio: new Date().toISOString(),
    estado_notificacion: "No leida"
  })
  if (error) throw error
}
