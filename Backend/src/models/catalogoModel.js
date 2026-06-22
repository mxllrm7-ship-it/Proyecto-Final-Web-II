import { supabase } from "../config/supabase.js"

export const obtenerCatalogoModel = async () => {
  const { data, error } = await supabase.rpc("obtener_eventos_catalogo")
  if (error) throw error
  return data
}

export const buscarEventosPorNombreModel = async (nombre) => {
  const { data, error } = await supabase.rpc("buscar_eventos_por_nombre", {
    p_nombre: nombre
  })
  if (error) throw error
  return data
}

export const obtenerCategoriasModel = async () => {
  const { data, error } = await supabase.rpc("obtener_categorias_eventos")
  if (error) throw error
  return data
}

export const obtenerEventosPorCategoriaModel = async (categoria) => {
  const { data, error } = await supabase.rpc("obtener_eventos_por_categoria", {
    p_categoria: categoria
  })
  if (error) throw error
  return data
}