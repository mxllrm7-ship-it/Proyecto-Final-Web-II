import Evento from "../models/Evento";
import DetalleEvento from "../models/DetalleEvento";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/eventos`;

export const obtenerEventos = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener eventos");
    }

    const result = await response.json();

    return result.eventos.map((evento) => new Evento(evento));
  } catch (error) {
    console.error("Error en obtenerEventos:", error);
    throw error;
  }
};

export const obtenerDetalleEvento = async (idEvento) => {
  try {
    const response = await fetch(`${API_URL}/${idEvento}`);

    if (!response.ok) {
      throw new Error("Error al obtener detalle del evento");
    }

    const result = await response.json();

    return new DetalleEvento(result.detalle);
  } catch (error) {
    console.error("Error en obtenerDetalleEvento:", error);
    throw error;
  }
};
