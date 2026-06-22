import { supabase } from "../config/supabase.js"

export const buscarEventosPorNombreModel = async (nombre) => {
  const { data, error } = await supabase.rpc("obtenereventocoincidencianombre", {
    p_nombre: nombre
  })
  if (error) throw error
  return data
}