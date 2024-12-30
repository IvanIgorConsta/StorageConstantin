// Importar dependencias necesarias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const contractorsRouter = require('./routes/contractors'); // Ruta de contratistas
const clientsRouter = require('./routes/clients'); // Ruta de clientes
const serviceRequestsRouter = require('./routes/serviceRequests'); // Ruta de solicitudes de servicio
const authRouter = require('./routes/auth'); // Ruta de autenticación

require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Configuración de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configuración de limitador de solicitudes
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de solicitudes por IP
  message: 'Demasiadas solicitudes, por favor intente más tarde.',
}));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Configuración de rutas
app.use('/contractors', contractorsRouter); // Rutas de contratistas
app.use('/clients', clientsRouter); // Rutas de clientes
app.use('/service-requests', serviceRequestsRouter); // Rutas de solicitudes
app.use('/auth', authRouter); // Rutas de autenticación

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Middleware global para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

