export default class Ciudad {
  constructor({
    id_ciudad,
    nombre_ciudad,
    id_departamento,
    nombre_departamento
  }) {
    this.id_ciudad = id_ciudad
    this.nombre_ciudad = nombre_ciudad
    this.id_departamento = id_departamento
    this.nombre_departamento = nombre_departamento
  }

  static fromJson(json) {
    return new Ciudad(json)
  }
}