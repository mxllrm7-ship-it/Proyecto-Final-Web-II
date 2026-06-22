import { useEffect, useState } from "react";
import { Search, Briefcase } from "lucide-react";
import ServiceCard from "../ServiceCard/ServiceCard";
import { obtenerServicios } from "../../../services/ServiceService";
import "./ServicesPage.css";
import "../../../styles/styles.css";

export default function ServicesPage() {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarServicios = async () => {
    try {
      setLoading(true);
      const data = await obtenerServicios();
      setServicios(data);
      extraerCategorias(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const extraerCategorias = (data) => {
    const categoriasUnicas = {};
    data.forEach((servicio) => {
      if (servicio.categoria) {
        if (!categoriasUnicas[servicio.categoria]) {
          categoriasUnicas[servicio.categoria] = 0;
        }
        categoriasUnicas[servicio.categoria]++;
      }
    });

    const categoriasArray = Object.entries(categoriasUnicas).map(
      ([nombre, cantidad]) => ({
        categoria: nombre,
        cantidad,
      })
    );

    setCategorias(categoriasArray);
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const filtrarServicios = () => {
    let resultados = servicios;

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      resultados = resultados.filter((servicio) =>
        servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoriaSeleccionada) {
      resultados = resultados.filter(
        (servicio) => servicio.categoria === categoriaSeleccionada
      );
    }

    return resultados;
  };

  const serviciosFiltrados = filtrarServicios();

  const handleBuscar = (valor) => {
    setBusqueda(valor);
  };

  const handleCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="services-hero-content">
          <Briefcase className="services-hero-icon" size={48} />
          <h1 className="services-hero-title">Servicios para tu Evento</h1>
          <p className="services-hero-desc">
            Encuentra proveedores especializados para hacer realidad tu evento.
          </p>
        </div>
        <div className="services-hero-bg" />
      </div>

      <div className="services-filters-container">
        <div className="services-filters">
          <div className="services-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value)}
            />
          </div>

          <select
            value={categoriaSeleccionada}
            onChange={(e) => handleCategoria(e.target.value)}
            className="services-category-select"
          >
            <option value="">Todas las categorías</option>

            {categorias.map((cat) => (
              <option key={cat.categoria} value={cat.categoria}>
                {cat.categoria} ({cat.cantidad})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="services-content-wrapper">
        <div className="services-results-bar">
          <span className="services-results-count">
            {serviciosFiltrados.length} servicio
            {serviciosFiltrados.length !== 1 ? "s" : ""} encontrado
            {serviciosFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="services-empty">
            <div className="services-loading-spinner"></div>
            <p>Cargando servicios...</p>
          </div>
        ) : serviciosFiltrados.length > 0 ? (
          <div className="services-grid">
            {serviciosFiltrados.map((servicio) => (
              <ServiceCard key={servicio.id} service={servicio} />
            ))}
          </div>
        ) : (
          <div className="services-empty">
            <Briefcase className="services-empty-icon" size={48} />
            <p>No se encontraron servicios.</p>
          </div>
        )}
      </div>
    </div>
  );
}
