import { supabase } from "../config/supabase.js"

export const obtenerEventosModel = async () => {
  const { data, error } = await supabase.rpc("obtener_eventos")
  if (error) throw error
  return data
}