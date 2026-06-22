import { supabase } from "../config/supabase.js"
import bcrypt from "bcrypt"

export const loginModel = async ({ username, password }) => {
  const { data, error } = await supabase
    .from("usuario")
    .select(`
      id_usuario,
      id_rol,
      rol(nombre),
      nombre_usuario,
      correo,
      telefono,
      username,
      estado_usuario,
      foto_rostro,
      password
    `)
    .eq("username", username)
    .single()

  if (error) {
    if (error.code === "PGRST116") throw new Error("Usuario no encontrado.")
    throw error
  }

  const coincide = await bcrypt.compare(password, data.password)
  if (!coincide) throw new Error("Contraseña incorrecta.")

  const { password: _, ...usuario } = data
  usuario.nombre_rol = usuario.rol?.nombre ?? null
  delete usuario.rol

  return usuario
}