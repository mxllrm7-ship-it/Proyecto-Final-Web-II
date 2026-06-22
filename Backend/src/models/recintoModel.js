import { supabase } from "../config/supabase.js"

export const obtenerCatalogoRecintosModel = async () => {
  const { data, error } = await supabase.rpc("obtener_catalogo_recintos")
  if (error) throw error
  return data
}