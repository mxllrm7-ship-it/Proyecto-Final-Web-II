import { useEffect, useState } from "react";
import { Search, Ticket } from "lucide-react";
import EventCard from "../EventCard/EventCard";
import {
  obtenerCatalogoEventos,
  obtenerCategoriasEventos,
  obtenerEventosPorCategoria,
  buscarEventosPorNombre,
} from "../../../services/CatalogoService";
import "./Eventspage.css";
import "../../../styles/styles.css";

export default function EventsPage() {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const data = await obtenerCatalogoEventos();
      setEventos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategoriasEventos();
      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEventos();
    cargarCategorias();
  }, []);

  const handleBuscar = async (valor) => {
    setBusqueda(valor);

    try {
      setLoading(true);

      if (!valor.trim()) {
        if (categoriaSeleccionada) {
          const data = await obtenerEventosPorCategoria(
            categoriaSeleccionada
          );
          setEventos(data);
        } else {
          const data = await obtenerCatalogoEventos();
          setEventos(data);
        }

        return;
      }

      const data = await buscarEventosPorNombre(valor);
      setEventos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoria = async (categoria) => {
    setCategoriaSeleccionada(categoria);

    try {
      setLoading(true);

      if (!categoria) {
        if (busqueda.trim()) {
          const data = await buscarEventosPorNombre(busqueda);
          setEventos(data);
        } else {
          const data = await obtenerCatalogoEventos();
          setEventos(data);
        }

        return;
      }

      const data = await obtenerEventosPorCategoria(categoria);
      setEventos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-page">
      <div className="events-hero">
        <div className="events-hero-content">
          <Ticket className="events-hero-icon" size={48} />
          <h1 className="events-hero-title">Descubre Eventos</h1>
          <p className="events-hero-desc">
            Encuentra conciertos, festivales, deportes, cultura y mucho más.
          </p>
        </div>
        <div className="events-hero-bg" />
      </div>

      <div className="events-filters">
        <div className="events-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar evento..."
            value={busqueda}
            onChange={(e) => handleBuscar(e.target.value)}
          />
        </div>

        <select
          value={categoriaSeleccionada}
          onChange={(e) => handleCategoria(e.target.value)}
          className="events-category-select"
        >
          <option value="">Todas las categorías</option>

          {categorias.map((categoria) => (
            <option
              key={categoria.categoria}
              value={categoria.categoria}
            >
              {categoria.categoria} ({categoria.cantidadEventos})
            </option>
          ))}
        </select>
      </div>

      <div className="events-results-bar">
        <span className="events-results-count">
          {eventos.length} evento{eventos.length !== 1 ? "s" : ""} encontrado
          {eventos.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="events-empty">
          <p>Cargando eventos...</p>
        </div>
      ) : eventos.length > 0 ? (
        <div className="events-grid">
          {eventos.map((evento) => (
            <EventCard
              key={evento.idEvento}
              event={evento}
            />
          ))}
        </div>
      ) : (
        <div className="events-empty">
          <Ticket className="events-empty-icon" size={48} />
          <p>No se encontraron eventos.</p>
        </div>
      )}
    </div>
  );
}