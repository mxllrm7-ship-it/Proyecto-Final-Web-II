import { supabase } from "../config/supabase.js"

export const obtenerMisEventosModel = async (id_usuario) => {
  const { data, error } = await supabase.rpc("obtener_mis_eventos", {
    p_id_usuario: id_usuario
  })
  if (error) throw error
  return data
}