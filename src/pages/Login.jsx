import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Logged In:', formData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-900">
      {/* Animación en el fondo */}
      <div className="absolute inset-0 z-0">
        <div className="w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-3xl absolute -top-10 -left-10 animate-floating"></div>
        <div className="w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-3xl absolute top-20 right-20 animate-floating"></div>
      </div>

      {/* Tarjeta de inicio de sesión */}
      <div className="relative bg-white shadow-xl rounded-lg p-8 max-w-md w-full z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Inicia sesión en ManitasFix</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="email">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu correo electrónico"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300 shadow-lg"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
