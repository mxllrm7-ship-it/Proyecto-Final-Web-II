import { supabase } from "../config/supabase.js"

export const contratarServicioModel = async ({ id_evento, id_servicio, cantidad }) => {
  const { data, error } = await supabase.rpc("contratar_servicio", {
    p_id_evento: id_evento,
    p_id_servicio: id_servicio,
    p_cantidad: cantidad ?? 1
  })
  if (error) throw error
  return data
}