import SearchModel from "../models/SearchModel";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/search`;

export const buscarEventos = async (termino) => {
  const response = await fetch(
    `${API_URL}?q=${encodeURIComponent(termino)}`
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(
      data.mensaje || "Error al buscar eventos"
    );
  }

  return data.eventos.map((evento) =>
    SearchModel.fromJson(evento)
  );
};