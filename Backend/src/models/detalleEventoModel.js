import { supabase } from "../config/supabase.js"

export const obtenerDetalleEventoModel = async (id_evento) => {
  const { data, error } = await supabase.rpc("obtener_detalle_evento", {
    p_id_evento: id_evento
  })
  if (error) throw error
  return data
}