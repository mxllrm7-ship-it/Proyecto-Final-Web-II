import React, { useState } from 'react';
import './SignUp.css';
import '../../../styles/styles.css'
import { registrarUsuario } from '../../../services/usuarioService';

export default function SignUpUser() {
  const [nombre_usuario, setNombre_usuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password && password !== newConfirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const usuario = await registrarUsuario({ nombre_usuario, correo, telefono, username, password, foto_rostro: null });
      console.log('Usuario registrado:', usuario);
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Crear Cuenta</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-form-group">
            <label htmlFor="nombre_usuario" className="signup-label">Nombre Completo</label>
            <input
              type="text"
              id="nombre_usuario"
              className="signup-input"
              value={nombre_usuario}
              onChange={(e) => setNombre_usuario(e.target.value)}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="correo" className="signup-label">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              className="signup-input"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="telefono" className="signup-label">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              className="signup-input"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="username" className="signup-label">Usuario</label>
            <input
              type="text"
              id="username"
              className="signup-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Elige tu usuario"
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="password" className="signup-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="signup-input"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Crea una contraseña segura"
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="confirmPassword" className="signup-label">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              className={`signup-input ${passwordError ? 'signup-input-error' : ''}`}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirma tu contraseña"
              required
            />
            {passwordError && <span className="signup-error-message">{passwordError}</span>}
          </div>

          {error && <span className="signup-error-message">{error}</span>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="signup-footer">
          <p className="signup-text">¿Ya tienes cuenta? <a href="/login" className="signup-link">Iniciar Sesión</a></p>
        </div>
      </div>
    </div>
  );
}