import RecintoModel from "../models/RecintoModel";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/recintos/catalogo`;

export async function obtenerRecintos() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener recintos");
    }

    const data = await response.json();

    return data.recintos.map((recinto) =>
      RecintoModel.fromJson(recinto)
    );
  } catch (error) {
    console.error("Error en obtenerRecintos:", error);
    throw error;
  }
}