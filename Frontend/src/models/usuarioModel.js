export class Usuario {
  constructor({ id_usuario, id_rol, nombre_rol, nombre_usuario, correo, telefono, username, estado_usuario, foto_rostro, foto_perfil }) {
    this.id_usuario = id_usuario
    this.id_rol = id_rol
    this.nombre_rol = nombre_rol
    this.nombre_usuario = nombre_usuario
    this.correo = correo
    this.telefono = telefono
    this.username = username
    this.estado_usuario = estado_usuario
    this.foto_rostro = foto_rostro ?? null
    this.foto_perfil = foto_perfil ?? null
  }
}

export class RegistroPayload {
  constructor({ nombre_usuario, correo, telefono, username, password, foto_rostro }) {
    this.nombre_usuario = nombre_usuario
    this.correo = correo
    this.telefono = telefono
    this.username = username
    this.password = password
    this.foto_rostro = foto_rostro ?? null
  }
}

export class LoginPayload {
  constructor({ username, password }) {
    this.username = username
    this.password = password
  }
}

export class EditarPerfilPayload {
  constructor({ nombre_usuario, correo, telefono, username, foto_perfil }) {
    this.nombre_usuario = nombre_usuario ?? null
    this.correo = correo ?? null
    this.telefono = telefono ?? null
    this.username = username ?? null
    this.foto_perfil = foto_perfil ?? null
  }
}