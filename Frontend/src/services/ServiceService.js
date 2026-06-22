import ServiceModel from "../models/ServiceModel";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/servicios/catalogo`;

export async function obtenerServicios() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener los servicios");
    }

    const data = await response.json();

    return data.servicios.map((servicio) =>
      ServiceModel.fromJson(servicio)
    );
  } catch (error) {
    console.error("Error en obtenerServicios:", error);
    throw error;
  }
}