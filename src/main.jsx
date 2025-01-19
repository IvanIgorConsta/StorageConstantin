// Importar React y ReactDOM para manejar el árbol de componentes
import React from 'react';
import { createRoot } from 'react-dom/client'; // Usar createRoot para React 18
import './index.css'; // Importar estilos globales
import App from './App.jsx'; // Importar el componente principal de la aplicación

// Crear el punto de entrada de la aplicación
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("El elemento con id 'root' no existe en el archivo index.html.");
}

// Renderizar la aplicación en el punto de entrada
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
