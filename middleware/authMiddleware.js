
const jwt = require('jsonwebtoken');
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403
};

function authenticateToken(req, res, next) {
  // Extrae el header de autorización
  const authHeader = req.headers.authorization;

  // Verifica que el header de autorización exista
  if (!authHeader) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Acceso denegado. No se proporcionó un header de autorización.' });
  }

  // Extrae el token del header de autorización
  const token = authHeader.split(' ')[1];

  // Verifica que el token exista
  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  // Verifica el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Si el token es inválido o expirado, retorna un error
    if (err) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Token inválido o expirado.' });
    }

    // Si el token es válido, agrega la información del usuario a la solicitud
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;