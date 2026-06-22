import { supabase } from "../config/supabase.js"

export const realizarCompraModel = async ({
  id_usuario,
  id_tipo_boleto,
  cantidad,
  id_metodo_pago,
  comprador_nombre,
  comprador_correo,
  comprador_celular,
  comprador_nit
}) => {
  const { data, error } = await supabase.rpc("realizar_compra_evento", {
    p_id_usuario: id_usuario,
    p_id_tipo_boleto: id_tipo_boleto,
    p_cantidad: cantidad,
    p_id_metodo_pago: id_metodo_pago,
    p_comprador_nombre: comprador_nombre,
    p_comprador_correo: comprador_correo,
    p_comprador_celular: comprador_celular,
    p_comprador_nit: comprador_nit ?? null
  })
  if (error) throw error
  return data
}