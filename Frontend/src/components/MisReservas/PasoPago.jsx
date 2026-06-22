import { useEffect, useState } from 'react';
import { obtenerMetodosPago, pagarReserva } from '../../services/MisReservasService';
import { useAuth } from '../../context/AuthContext';
import './PasoPago.css';

export default function PasoPago({ idOrden, montoTotal, onPagado }) {
  const { token } = useAuth();
  const [metodos, setMetodos] = useState([]);
  const [idMetodo, setIdMetodo] = useState('');
  const [tipoPago, setTipoPago] = useState('total'); // 'adelanto' | 'total'
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerMetodosPago(token).then((m) => {
      // Solo mostrar método QR en la web
      const soloQR = m.filter(x => x.nombre?.toLowerCase().includes('qr'));
      const lista = soloQR.length > 0 ? soloQR : m;
      setMetodos(lista);
      if (lista.length > 0) setIdMetodo(lista[0].id_metodo_pago);
    }).catch(() => {});
  }, [token]);

  const montoAdelanto = Math.round(montoTotal * 0.15 * 100) / 100;
  const montoAPagar = tipoPago === 'adelanto' ? montoAdelanto : montoTotal;

  const confirmar = async () => {
    setEnviando(true);
    setError('');
    try {
      const resultado = await pagarReserva({ id_orden: idOrden, tipo_pago: tipoPago, id_metodo_pago: idMetodo }, token);
      onPagado(resultado);
    } catch (err) {
      setError(err.message || 'No se pudo procesar el pago.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="pasopago">
      <div className="pasopago-tipos">
        <button
          type="button"
          className={`pasopago-tipo ${tipoPago === 'adelanto' ? 'is-active' : ''}`}
          onClick={() => setTipoPago('adelanto')}
        >
          Adelanto 15%
          <span>Bs {montoAdelanto.toFixed(2)}</span>
        </button>
        <button
          type="button"
          className={`pasopago-tipo ${tipoPago === 'total' ? 'is-active' : ''}`}
          onClick={() => setTipoPago('total')}
        >
          Pago total
          <span>Bs {montoTotal.toFixed(2)}</span>
        </button>
      </div>

      <label className="pasopago-label">Método de pago</label>
      <select className="pasopago-select" value={idMetodo} onChange={(e) => setIdMetodo(e.target.value)}>
        {metodos.map((m) => (
          <option key={m.id_metodo_pago} value={m.id_metodo_pago}>{m.nombre}</option>
        ))}
      </select>

      <div className="pasopago-total">
        A pagar ahora: <strong>Bs {montoAPagar.toFixed(2)}</strong>
        {tipoPago === 'adelanto' && (
          <span className="pasopago-saldo"> · Saldo pendiente: Bs {(montoTotal - montoAdelanto).toFixed(2)}</span>
        )}
      </div>

      {error && <div className="pasopago-error">{error}</div>}

      <button className="pasopago-btn-confirmar" onClick={confirmar} disabled={enviando || !idMetodo}>
        {enviando ? 'Procesando...' : 'Confirmar pago'}
      </button>
    </div>
  );
}
