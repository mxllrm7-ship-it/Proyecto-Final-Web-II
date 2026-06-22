import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { House, Music, Drama, Briefcase, MapPinned, Ticket, LogIn, UserPlus, LogOut, User, Search, X, ShoppingCart, ShieldCheck } from 'lucide-react';
import "./NavBar.css";
import "../../../styles/styles.css";
import { useAuth } from '../../../context/AuthContext';
import { buscarEventos } from '../../../services/SearchService';
import NotificationBell from './NotificationBell';

export default function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [cargando, setCargando] = useState(false);
  const { usuario, logout } = useAuth();
  const esAdmin = (usuario?.nombre_rol || '').trim().toLowerCase() === 'administrador';
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/');
  };

  const limpiarSearch = () => {
    setSearchQuery('');
    setResultados([]);
    setMostrarDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMostrarDropdown(false);
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResultadoClick = (idEvento) => {
    limpiarSearch();
    navigate(`/eventos/${idEvento}`);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchQuery.trim()) {
      setResultados([]);
      setMostrarDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setCargando(true);
      try {
        const data = await buscarEventos(searchQuery.trim());
        setResultados(data);
        setMostrarDropdown(true);
      } catch {
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatearFecha = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <img src="/LogoNodus.webp" alt="Logo" className="navbar-logo" />
        <ul className="navbar-links">
          <li><Link to="/"><House size={16} /><span>Inicio</span></Link></li>
          <li><Link to="/eventos"><Music size={16} /><span>Conciertos y Festivales</span></Link></li>
          <li><Link to="/eventos"><Drama size={16} /><span>Teatro y Cultura</span></Link></li>
          <li><Link to="/servicios"><Briefcase size={16} /><span>Servicios</span></Link></li>
          <li><Link to="/Recintos"><MapPinned size={16} /><span>Recintos</span></Link></li>
          {usuario && (
            <li><Link to="/mis-eventos"><ShoppingCart size={16} /><span>Mis Compras</span></Link></li>
          )}
        </ul>
        <div className="navbar-buttons">
          {usuario ? (
            <div className="navbar-user">
              <NotificationBell />
              <Link to="/profile" className="navbar-username" title={usuario.nombre_usuario}>
                <User size={16} />
                <span>@{usuario.username}</span>
              </Link>
              {esAdmin && (
                <Link to="/admin" className="navbar-btn-admin">
                  <ShieldCheck size={16} />
                  <span>Panel Admin</span>
                </Link>
              )}
              <button className="navbar-btn-login" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-btn-login">
                <LogIn size={16} />
                <span>Ingresar</span>
              </Link>
              <Link to="/signup" className="navbar-btn-register">
                <UserPlus size={16} />
                <span>Registrarse</span>
              </Link>
            </>
          )}
        </div>
        <button className="hamburger" onClick={toggleSidebar} aria-label="Abrir menú">
          <span className={`hamburger-line ${sidebarOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${sidebarOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${sidebarOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      <div className="navbar-search-row">
        <form className="navbar-search-form" onSubmit={handleSearch}>
          <div className="navbar-search-input-wrapper" ref={searchRef}>
            <Search size={16} className="navbar-search-icon" />
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Buscar eventos, recintos, servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (resultados.length > 0) setMostrarDropdown(true); }}
              autoComplete="off"
            />
            {searchQuery && (
              <button type="button" className="navbar-search-clear" onClick={limpiarSearch}>
                <X size={14} />
              </button>
            )}

            {mostrarDropdown && (
              <div className="navbar-search-dropdown">
                {cargando ? (
                  <div className="navbar-search-estado">Buscando...</div>
                ) : resultados.length === 0 ? (
                  <div className="navbar-search-estado">Sin resultados para "{searchQuery}"</div>
                ) : (
                  <>
                    <div className="navbar-search-dropdown-header">
                      {resultados.length} resultado{resultados.length !== 1 ? 's' : ''}
                    </div>
                    {resultados.map((evento) => (
                      <div
                        key={evento.idEvento}
                        className="navbar-search-item"
                        onClick={() => handleResultadoClick(evento.idEvento)}
                      >
                        <div className="navbar-search-item-img">
                          {evento.imagenUrl ? (
                            <img src={evento.imagenUrl} alt={evento.nombreEvento} />
                          ) : (
                            <div className="navbar-search-item-img-placeholder">
                              <Music size={16} />
                            </div>
                          )}
                        </div>
                        <div className="navbar-search-item-info">
                          <span className="navbar-search-item-nombre">{evento.nombreEvento}</span>
                          <span className="navbar-search-item-meta">
                            {evento.nombreCiudad} · {evento.nombreRecinto} · {formatearFecha(evento.fecha)}
                          </span>
                        </div>
                        <span className="navbar-search-item-categoria">{evento.categoria}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {sidebarOpen && <div className="navbar-overlay" onClick={closeSidebar}></div>}
      <div className={`navbar-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <ul className="navbar-sidebar-links">
          <li><Link to="/" onClick={closeSidebar}><House size={16} /><span>Inicio</span></Link></li>
          <li><Link to="/eventos" onClick={closeSidebar}><Music size={16} /><span>Conciertos y Festivales</span></Link></li>
          <li><Link to="/eventos" onClick={closeSidebar}><Drama size={16} /><span>Teatro y Cultura</span></Link></li>
          <li><Link to="/servicios" onClick={closeSidebar}><Briefcase size={16} /><span>Servicios</span></Link></li>
          <li><Link to="/Recintos" onClick={closeSidebar}><MapPinned size={16} /><span>Recintos</span></Link></li>
          {usuario && (
            <li><Link to="/mis-eventos" onClick={closeSidebar}><Ticket size={16} /><span>Mis Tickets</span></Link></li>
          )}
        </ul>
        <div className="navbar-sidebar-buttons">
          {usuario ? (
            <div className="navbar-sidebar-user">
              <Link to="/profile" className="navbar-sidebar-username" onClick={closeSidebar} title={usuario.nombre_usuario}>
                <User size={16} />
                <span>@{usuario.username}</span>
              </Link>
              {esAdmin && (
                <Link to="/admin" className="navbar-sidebar-btn-register" onClick={closeSidebar}>
                  <ShieldCheck size={16} />
                  <span>Panel Admin</span>
                </Link>
              )}
              <button className="navbar-sidebar-btn-login" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-sidebar-btn-login" onClick={closeSidebar}>
                <LogIn size={16} />
                <span>Ingresar</span>
              </Link>
              <Link to="/signup" className="navbar-sidebar-btn-register" onClick={closeSidebar}>
                <UserPlus size={16} />
                <span>Registrarse</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}