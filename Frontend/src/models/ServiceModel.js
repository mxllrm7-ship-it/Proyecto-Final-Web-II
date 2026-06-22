export default class ServiceModel {
  constructor({
    id,
    nombre,
    categoria,
    proveedores = []
  }) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.proveedores = proveedores;
  }

  static fromJson(json) {
    return new ServiceModel({
      id: json.id,
      nombre: json.nombre,
      categoria: json.categoria,
      proveedores: json.proveedores || []
    });
  }
}