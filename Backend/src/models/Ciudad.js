import { supabase } from "../config/supabase.js";

export const obtenerCiudadesModel = async () => {
  const { data, error } = await supabase
    .from("ciudad")
    .select(`
      id_ciudad,
      nombre_ciudad,
      departamento (
        id_departamento,
        nombre_departamento
      )
    `)
    .order("nombre_ciudad", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(ciudad => ({
    id_ciudad: ciudad.id_ciudad,
    nombre_ciudad: ciudad.nombre_ciudad,
    id_departamento: ciudad.departamento?.id_departamento,
    nombre_departamento: ciudad.departamento?.nombre_departamento
  }));
};