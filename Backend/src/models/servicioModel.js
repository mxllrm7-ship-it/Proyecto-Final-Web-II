import { supabase } from "../config/supabase.js"

export const obtenerServiciosCatalogoModel = async () => {
  const { data, error } = await supabase.rpc("obtener_servicios_catalogo")
  if (error) throw error
  return data
}