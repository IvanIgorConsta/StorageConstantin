const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Configuración de dotenv para leer las variables de entorno
dotenv.config();

// Usar una variable de entorno para el secreto en lugar de una cadena estática
// Esto hace que tu aplicación sea más segura y flexible
const secret = process.env.JWT_SECRET;

// Personaliza el payload según tu aplicación
const payload = { userId: '12345', role: 'client' };

// Token válido por 12 horas
// Puedes cambiar el vencimiento a lo que quieras
// Podrías incluso usar una variable de entorno para hacerlo más flexible
const token = jwt.sign(payload, secret, { expiresIn: '12h' });

console.log('Tu token válido:', token);
