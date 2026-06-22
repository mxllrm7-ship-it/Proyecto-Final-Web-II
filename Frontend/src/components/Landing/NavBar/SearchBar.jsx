import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronUp } from "lucide-react";
import "react-day-picker/dist/style.css";
import "./SearchBar.css";
import "../../../styles/styles.css";
import { obtenerCiudades } from "../../../services/CiudadService";

export default function SearchBar({ onToggleSearch, isVisible }) {
  const [ciudades, setCiudades] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const cargarCiudades = async () => {
      try {
        const data = await obtenerCiudades();
        setCiudades(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarCiudades();
  }, []);

  const filteredCities = ciudades.filter((ciudad) =>
    ciudad.nombre_ciudad
      .toLowerCase()
      .includes(selectedCity.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="search-bar-wrapper">
      <button 
        className="search-toggle-btn"
        onClick={onToggleSearch}
        aria-label={isVisible ? "Ocultar filtros" : "Mostrar filtros"}
      >
        <span>{isVisible ? "Ocultar filtros" : "Mostrar filtros"}</span>
        <ChevronUp size={18} className={`toggle-icon ${!isVisible ? 'rotated' : ''}`} />
      </button>
      
      <div className="search-bar-container">
        <div className="search-bar">
          <div className="search-bar-row">
            <div className="city-selector">
              <label className="search-label">Ciudad</label>

              <div className="combobox-wrapper">
                <input
                  type="text"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  placeholder="Selecciona una ciudad"
                  className="combobox-input"
                />

                {showCityDropdown && (
                  <div className="dropdown-list">
                    {filteredCities.map((ciudad) => (
                      <div
                        key={ciudad.id_ciudad}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedCity(ciudad.nombre_ciudad);
                          setShowCityDropdown(false);
                        }}
                      >
                        {ciudad.nombre_ciudad}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="date-range-picker">
              <div className="date-picker-group">
                <label className="search-label">Fecha Inicio</label>

                <div className="date-input-wrapper">
                  <input
                    type="text"
                    value={formatDate(startDate)}
                    onFocus={() => {
                      setShowStartCalendar(true);
                      setShowEndCalendar(false);
                    }}
                    readOnly
                    placeholder="DD/MM/YYYY"
                    className="date-input"
                  />

                  {showStartCalendar && (
                    <div className="calendar-popup">
                      <DayPicker
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setShowStartCalendar(false);
                        }}
                        disabled={(date) =>
                          endDate ? date > endDate : false
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="date-picker-group">
                <label className="search-label">Fecha Final</label>

                <div className="date-input-wrapper">
                  <input
                    type="text"
                    value={formatDate(endDate)}
                    onFocus={() => {
                      setShowEndCalendar(true);
                      setShowStartCalendar(false);
                    }}
                    readOnly
                    placeholder="DD/MM/YYYY"
                    className="date-input"
                  />

                  {showEndCalendar && (
                    <div className="calendar-popup">
                      <DayPicker
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          setShowEndCalendar(false);
                        }}
                        disabled={(date) =>
                          startDate ? date < startDate : false
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="search-input-group">
              <label className="search-label">Búsqueda</label>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="search-input"
              />
            </div>

            <button className="search-button">Buscar</button>
          </div>
        </div>
      </div>
    </div>
  );
}