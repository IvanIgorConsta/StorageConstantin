
# ManitasFix API

## Descripción
ManitasFix es una API diseñada para conectar contratistas con clientes que necesitan servicios de reparación y mantenimiento para el hogar en Miami. Esta plataforma permite:

- Registrar y gestionar clientes.
- Registrar y gestionar contratistas.
- Crear, actualizar y eliminar solicitudes de servicios.
- Proteger endpoints mediante autenticación basada en tokens.

---

## Instalación

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **MongoDB Atlas** o una instancia local de MongoDB

### Configuración
1. Clona este repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd manitasfix-backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`:
   ```plaintext
   MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/ManitasFixDB?retryWrites=true&w=majority&tls=true
   JWT_SECRET=navidad
   ```
4. Inicia el servidor:
   ```bash
   node server.js
   ```

---

## Endpoints de la API

### **Clientes**
#### Crear un cliente
- **POST** `/clients`
  - **Body (JSON):**
    ```json
    {
      "name": "Juan Pérez",
      "email": "juan.perez@example.com",
      "phone": "555-1234",
      "location": "Miami, FL",
      "password": "mi_contraseña_segura"
    }
    ```
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

#### Obtener todos los clientes
- **GET** `/clients`
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

#### Actualizar un cliente por ID
- **PUT** `/clients/:id`
  - **Body (JSON):**
    ```json
    {
      "name": "Juan Actualizado",
      "email": "juan.actualizado@example.com",
      "phone": "555-9876",
      "location": "Miami Beach, FL"
    }
    ```
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

#### Eliminar un cliente por ID
- **DELETE** `/clients/:id`
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

---

### **Contratistas**
#### Crear un contratista
- **POST** `/contractors`
  - **Body (JSON):**
    ```json
    {
      "name": "María López",
      "email": "maria.lopez@example.com",
      "phone": "555-4321",
      "location": "Miami, FL",
      "password": "mi_contraseña_segura"
    }
    ```
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

#### Obtener todos los contratistas
- **GET** `/contractors`
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

#### Actualizar un contratista por ID
- **PUT** `/contractors/:id`
  - **Body (JSON):**
    ```json
    {
      "name": "María Actualizada",
      "email": "maria.actualizada@example.com",
      "phone": "555-6789",
      "location": "Miami Beach, FL"
    }
    ```
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

#### Eliminar un contratista por ID
- **DELETE** `/contractors/:id`
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

---

### **Solicitudes de Servicio**
#### Crear una solicitud
- **POST** `/service-requests`
  - **Body (JSON):**
    ```json
    {
      "clientId": "<id-del-cliente>",
      "contractorId": "<id-del-contratista>",
      "description": "Reparar un grifo con fuga",
      "date": "2024-12-30"
    }
    ```
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

#### Obtener todas las solicitudes de un contratista
- **GET** `/service-requests/contractor/:contractorId`
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

#### Obtener todas las solicitudes de un cliente
- **GET** `/service-requests/client/:clientId`
  - **Headers:**
    ```
    Authorization: Bearer <token>
    ```

---

## Consideraciones Finales
- **Autenticación:** Todos los endpoints protegidos requieren un token válido en el header `Authorization`.
- **Errores Comunes:**
  - **401:** Acceso denegado por falta de token.
  - **403:** Token inválido o expirado.
  - **404:** Recurso no encontrado.

---

¡Gracias por usar ManitasFix API!
