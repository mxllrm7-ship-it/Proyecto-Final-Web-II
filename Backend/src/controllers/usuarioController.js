import { crearClienteModel, editarPerfilModel } from "../models/usuarioModel.js"

export const crearCliente = async (req, res) => {
  const { nombre_usuario, correo, telefono, username, password, foto_rostro } = req.body

  if (!nombre_usuario || !correo || !telefono || !username || !password) {
    return res.status(400).json({ ok: false, mensaje: "Faltan campos obligatorios." })
  }

  try {
    const nuevoUsuario = await crearClienteModel({ nombre_usuario, correo, telefono, username, password, foto_rostro })
    return res.status(201).json({ ok: true, usuario: nuevoUsuario })
  } catch (error) {
    if (error.message?.includes("ya está en uso") || error.message?.includes("ya está registrado")) {
      return res.status(409).json({ ok: false, mensaje: error.message })
    }
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}

export const editarPerfil = async (req, res) => {
  const id_usuario = req.usuario.id_usuario
  const { nombre_usuario, correo, telefono, username, foto_perfil } = req.body

  try {
    const usuarioActualizado = await editarPerfilModel({ id_usuario, nombre_usuario, correo, telefono, username, foto_perfil })

    if (!usuarioActualizado) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." })
    }

    return res.status(200).json({ ok: true, usuario: usuarioActualizado })
  } catch (error) {
    if (error.message?.includes("no encontrado")) {
      return res.status(404).json({ ok: false, mensaje: error.message })
    }
    if (error.message?.includes("ya está en uso") || error.message?.includes("ya está registrado")) {
      return res.status(409).json({ ok: false, mensaje: error.message })
    }
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}