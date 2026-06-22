import { useEffect, useState } from "react";
import { Search, Building2, Landmark, MapPinned } from "lucide-react";
import RecintoCard from "./RecintoCard/RecintoCard.jsx";
import ReservaModal from "./ReservaModal/ReservaModal.jsx";
import { obtenerRecintos } from "../../services/RecintoService";
import "./RecintosPage.css";
import "../../styles/styles.css";

export default function RecintosPage() {
  const [recintos, setRecintos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [recintoSeleccionado, setRecintoSeleccionado] = useState(null);

  const cargarRecintos = async () => {
    try {
      setLoading(true);
      const data = await obtenerRecintos();
      setRecintos(data);
      extraerFiltros(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const extraerFiltros = (data) => {
    const ciudadesUnicas = [...new Set(data.map((r) => r.ciudad))].sort();
    const tiposUnicos = [...new Set(data.map((r) => r.tipo))].sort();
    setCiudades(ciudadesUnicas);
    setTipos(tiposUnicos);
  };

  useEffect(() => { cargarRecintos(); }, []);

  const filtrarRecintos = () => {
    let resultado = recintos;
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (r) =>
          r.nombre.toLowerCase().includes(busquedaLower) ||
          r.ciudad.toLowerCase().includes(busquedaLower)
      );
    }
    if (ciudadSeleccionada) resultado = resultado.filter((r) => r.ciudad === ciudadSeleccionada);
    if (tipoSeleccionado) resultado = resultado.filter((r) => r.tipo === tipoSeleccionado);
    return resultado;
  };

  const recintosFiltrados = filtrarRecintos();

  return (
    <div className="recintos-page">
      <div className="recintos-hero">
        <div className="recintos-hero-content">
          <div className="recintos-hero-icons">
            <Building2 className="recintos-hero-icon" size={48} />
            <Landmark className="recintos-hero-icon" size={48} />
            <MapPinned className="recintos-hero-icon" size={48} />
          </div>
          <h1 className="recintos-hero-title">Encuentra el Recinto Ideal</h1>
          <p className="recintos-hero-desc">
            Explora auditorios, teatros, estadios y espacios disponibles para tu próximo evento.
          </p>
        </div>
        <div className="recintos-hero-bg" />
      </div>

      <div className="recintos-filters-container">
        <div className="recintos-filters">
          <div className="recintos-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select value={ciudadSeleccionada} onChange={(e) => setCiudadSeleccionada(e.target.value)} className="recintos-select">
            <option value="">Todas las ciudades</option>
            {ciudades.map((ciudad) => <option key={ciudad} value={ciudad}>{ciudad}</option>)}
          </select>
          <select value={tipoSeleccionado} onChange={(e) => setTipoSeleccionado(e.target.value)} className="recintos-select">
            <option value="">Todos los tipos</option>
            {tipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
          </select>
        </div>
      </div>

      <div className="recintos-content-wrapper">
        <div className="recintos-results-bar">
          <span className="recintos-results-count">
            {recintosFiltrados.length} recinto{recintosFiltrados.length !== 1 ? "s" : ""} encontrado{recintosFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="recintos-empty">
            <div className="recintos-loading-spinner"></div>
            <p>Cargando recintos...</p>
          </div>
        ) : recintosFiltrados.length > 0 ? (
          <div className="recintos-grid">
            {recintosFiltrados.map((recinto) => (
              <RecintoCard
                key={recinto.id}
                recinto={recinto}
                onContratar={(r) => setRecintoSeleccionado(r)}
              />
            ))}
          </div>
        ) : (
          <div className="recintos-empty">
            <Building2 className="recintos-empty-icon" size={48} />
            <p>No se encontraron recintos.</p>
          </div>
        )}
      </div>

      {recintoSeleccionado && (
        <ReservaModal
          recinto={recintoSeleccionado}
          onClose={() => setRecintoSeleccionado(null)}
        />
      )}
    </div>
  );
}