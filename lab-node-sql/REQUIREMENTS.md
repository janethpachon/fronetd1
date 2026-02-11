# DevMarket - Documento de Requerimientos

## 1. Descripción del Proyecto

**DevMarket** es una plataforma digital de productos para desarrolladores, construida con **Node.js + Express**, **Sequelize ORM**, **MySQL** y **frontend HTML/CSS/JavaScript puro**.

El proyecto implementa una tienda virtual donde los desarrolladores pueden comprar productos digitales como plantillas, snippets, APIs y tutoriales, clasificados por categoría, tecnología y nivel de dificultad.

---

## 2. Historias de Usuario Implementadas

### **Historia de Usuario 01 (HU-01): Autenticación de Usuarios**

**Titulo:** Como usuario, quiero registrarme e iniciar sesión para acceder a la tienda

**Criterios de Aceptación:**

1. **Registro de Usuario (RF-01)**
   - [x] El usuario puede registrarse proporcionando: nombre completo, email y contraseña
   - [x] Las contraseñas se almacenan de forma segura (hasheadas)
   - [x] Se valida que el email sea único
   - [x] Se valida que las contraseñas coincidan
   - [x] El rol predeterminado es "client" (cliente)

2. **Inicio de Sesión (RF-02)**
   - [x] El usuario puede iniciar sesión con email y contraseña
   - [x] Se validan las credenciales contra la base de datos
   - [x] Al iniciar sesión, se almacena la información del usuario en localStorage
   - [x] Se oculta la sección de autenticación y se muestra la tienda

3. **Gestión de Sesión (RF-03)**
   - [x] El usuario puede ver su nombre en la barra de navegación
   - [x] El usuario puede cerrar sesión en cualquier momento
   - [x] Al cerrar sesión, se limpia la información almacenada

**Endpoints utilizados:**
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile/:userId` - Obtener perfil del usuario

**Tecnologías utilizadas:**
- Frontend: HTML, CSS, JavaScript puro
- Backend: Node.js, Express
- Base de datos: MySQL con Sequelize ORM

---

### **Historia de Usuario 02 (HU-02): Visualización, Filtrado y Carrito de Productos**

**Titulo:** Como cliente, quiero ver productos, filtrarlos por múltiples criterios y agregarlos al carrito para realizar compras

**Criterios de Aceptación:**

1. **Visualización del Catálogo (RF-05)**
   - [x] Se muestra una grilla de productos con información: nombre, descripción, precio, tecnología y nivel
   - [x] Cada producto muestra su categoría e información básica
   - [x] Es posible ver el detalle completo de cada producto en un modal

2. **Filtrado de Productos (RF-07)**
   - [x] Filtrar por categoría
   - [x] Filtrar por tecnología (React, Vue, Node.js, Java, Python, etc.)
   - [x] Filtrar por nivel de dificultad (beginner, intermediate, advanced)
   - [x] Los filtros funcionan de forma combinada
   - [x] Existe botón para limpiar todos los filtros

3. **Detalle del Producto (RF-06)**
   - [x] Al hacer click en un producto, se abre un modal con:
     - Nombre completo
     - Descripción detallada
     - Tecnología asociada
     - Nivel de dificultad
     - Categoría
     - Precio
   - [x] Desde el modal se puede agregar el producto al carrito

4. **Carrito de Compras (RF-11)**
   - [x] Los usuarios pueden agregar productos al carrito
   - [x] Se muestra el número total de items en el carrito (en la navbar)
   - [x] Se puede abrir un sidebar con los items del carrito
   - [x] Se puede aumentar/disminuir cantidad de items
   - [x] Se puede eliminar items del carrito
   - [x] Se calcula automáticamente el precio total
   - [x] El carrito persiste en localStorage entre sesiones

5. **Generación de Órdenes (RF-12)**
   - [x] Al hacer click en "Proceder al Pago", se crea una orden ligada al usuario
   - [x] La orden incluye todos los items del carrito
   - [x] Se calcula el total automáticamente
   - [x] Se limpia el carrito después de la compra exitosa
   - [x] Se muestra un mensaje de confirmación

**Endpoints utilizados:**
- `GET /api/products` - Obtener todos los productos (con filtros opcionales)
- `GET /api/products/:id` - Obtener detalle de un producto
- `GET /api/products/categories/all` - Obtener categorías para filtros
- `GET /api/products/technologies/all` - Obtener tecnologías para filtros
- `POST /api/cart` - Agregar producto al carrito
- `GET /api/cart/:userId` - Obtener carrito del usuario
- `DELETE /api/cart/:cartId` - Eliminar item del carrito
- `POST /api/orders` - Crear orden de compra
- `GET /api/orders/user/:userId` - Obtener órdenes del usuario

**Tecnologías utilizadas:**
- Frontend: HTML, CSS, JavaScript puro
- Backend: Node.js, Express
- Base de datos: MySQL con Sequelize ORM

---

## 3. Modelos de Datos

### **Tabla: users**
```sql
- UserID (PK, Auto-increment)
- Email (UNIQUE)
- FullName
- Password (SHA256 hasheada)
- Role (ENUM: 'admin', 'client')
- createdAt, updatedAt (Timestamps)
```

### **Tabla: categories**
```sql
- CategoryID (PK, Auto-increment)
- CategoryName (UNIQUE)
- Description
- createdAt, updatedAt
```

### **Tabla: products**
```sql
- ProductID (PK, Auto-increment)
- ProductName
- Description
- Price (DECIMAL)
- Technology (ej: React, Node.js)
- DifficultyLevel (ENUM: beginner, intermediate, advanced)
- CategoryID (FK → categories)
- AdminID (FK → users)
- FileURL
- createdAt, updatedAt
```

### **Tabla: carts**
```sql
- CartID (PK, Auto-increment)
- UserID (FK → users)
- ProductID (FK → products)
- Quantity
- AddedAt
```

### **Tabla: orders**
```sql
- OrderID (PK, Auto-increment)
- UserID (FK → users)
- OrderDate
- TotalAmount (DECIMAL)
- Status (ENUM: pending, completed, cancelled)
- updatedAt
```

### **Tabla: order_items**
```sql
- OrderItemID (PK, Auto-increment)
- OrderID (FK → orders)
- ProductID (FK → products)
- Price (precio al momento de la compra)
```

---

## 4. Arquitectura de Microservicios

### Rutas API Implementadas

**Autenticación:**
```
POST   /api/auth/register         - Registrar usuario
POST   /api/auth/login            - Iniciar sesión
GET    /api/auth/profile/:userId  - Obtener perfil
```

**Productos:**
```
GET    /api/products                    - Listar con filtros
GET    /api/products/:id                - Detalle
POST   /api/products                    - Crear (admin)
PUT    /api/products/:id                - Actualizar (admin)
DELETE /api/products/:id                - Eliminar (admin)
GET    /api/products/categories/all     - Categorías
GET    /api/products/technologies/all   - Tecnologías
```

**Carrito:**
```
POST   /api/cart               - Agregar item
GET    /api/cart/:userId       - Obtener carrito
DELETE /api/cart/:cartId       - Eliminar item
DELETE /api/cart/clear/:userId - Vaciar carrito
```

**Órdenes:**
```
POST   /api/orders                           - Crear orden
GET    /api/orders/user/:userId              - Órdenes del usuario
GET    /api/orders/:orderId                  - Detalle de orden
GET    /api/orders                           - Todas (admin)
GET    /api/orders/download/:userId/:productId - Verificar descarga
```

---

## 5. Instalación y Ejecución

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Configurar Base de Datos

1. Crear base de datos MySQL con el script:
```bash
mysql -u root -p < scriptDevMarket.sql
```

2. Configurar variables en `.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=devmarket
```

### Paso 3: Iniciar Servidor
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

---

## 6. Flujo de Usuario (Full Stack)

### Registro e Inicio de Sesión (HU-01):
1. Usuario llena formulario de registro
2. Frontend valida datos del lado del cliente
3. Se envía POST a `/api/auth/register`
4. Backend valida unicidad del email y contraseña
5. Se hashea y almacena en la BD
6. Usuario puede iniciar sesión
7. Credenciales verifi (JWT almacenado en localStorage)
8. Se muestra la tienda

### Búsqueda y Compra (HU-02):
1. Usuario ve catálogo de productos
2. Aplica filtros (categoría, tecnología, dificultad)
3. Hace click en producto para ver detalles
4. Agrega productos al carrito
5. Abre sidebar del carrito
6. Modifica cantidades si es necesario
7. Procede al pago (crea orden)
8. Orden se registra en BD
9. Carrito se vacía

---

## 7. Credenciales de Prueba

```
Email: juan@example.com
Contraseña: pass123
Rol: client
```

(Ver más credenciales en scriptDevMarket.sql)

---

## 8. Pruebas Funcionales (Postman)

Las pruebas se encuentran documentadas en [test.http](./test.http)

**Ejemplos:**
- Registro: POST http://localhost:3000/api/auth/register
- Login: POST http://localhost:3000/api/auth/login
- Productos: GET http://localhost:3000/api/products?categoryId=1
- Carrito: POST http://localhost:3000/api/cart
- Órdenes: POST http://localhost:3000/api/orders

---

## 9. Restricciones del Proyecto

✅ **Permitido:**
- Node.js con Express ✓
- ORM (Sequelize) ✓
- MySQL ✓
- HTML/CSS/JavaScript puro ✓
- Arquitectura de microservicios ✓

❌ **NO permitido:**
- Spring Boot
- Componentes externos no vistos en clase
- Frameworks como React, Vue, etc.
- Tecnologías diferentes a las del curso

---

## 10. Estructura de Carpetas

```
lab-node-sql/
├── models/
│   ├── index.js
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── Order.js
│   └── OrderItem.js
├── controllers/
│   ├── authController.js
│   ├── productsController.js
│   ├── cartController.js
│   └── ordersController.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
├── server.js
├── scriptDevMarket.sql
└── .env
```

---

## 11. Documentación Técnica Adicional

### Seguridad (RNF-01, RNF-02)
- ✓ Contraseñas hasheadas con SHA256
- ✓ Control de acceso basado en roles
- ✓ Validación de entrada en backend
- ✓ CORS habilitado para desarrollo

### Rendimiento (RNF-03)
- ✓ Índices en BD para búsquedas rápidas
- ✓ Filtros a nivel de BD (no en memoria)
- ✓ Paginación opcional

### Usabilidad (RNF-05, RNF-06)
- ✓ Interfaz intuitiva y responsive
- ✓ Flujo de compra simple (max 4 interacciones)
- ✓ Feedback visual en cada acción

---

**Fecha:** 10 de Febrero de 2026  
**Versión:** 1.0  
**Estado:** Implementación Completa
