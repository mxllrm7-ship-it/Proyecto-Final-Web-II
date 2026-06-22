import { supabase } from "../config/supabase.js"
import bcrypt from "bcrypt"

const SALT_ROUNDS = 10

export const crearClienteModel = async ({ nombre_usuario, correo, telefono, username, password, foto_rostro }) => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS)

  const { data, error } = await supabase.rpc("crear_cliente", {
    p_nombre_usuario: nombre_usuario,
    p_correo: correo,
    p_telefono: telefono,
    p_username: username,
    p_password: hash,
    p_foto_rostro: foto_rostro ?? null
  })

  if (error) throw error
  return data[0]
}

export const editarPerfilModel = async ({ id_usuario, nombre_usuario, telefono, username, correo, foto_perfil }) => {
  const { data, error } = await supabase.rpc("editar_usuario", {
    p_id_usuario: id_usuario,
    p_nombre_usuario: nombre_usuario ?? null,
    p_telefono: telefono ?? null,
    p_username: username ?? null,
    p_correo: correo ?? null,
    p_foto_perfil: foto_perfil ?? null
  })

  if (error) throw error
  return data[0]
}