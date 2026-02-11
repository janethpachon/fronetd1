# 📱 DevMarket - Tienda Digital de Productos para Desarrolladores

Una plataforma moderna para comprar y vender productos digitales (plantillas, snippets, APIs, tutoriales) dirigida a desarrolladores de software.

## 🚀 Características

✅ **Autenticación de Usuarios** - Registro e inicio de sesión seguro  
✅ **Catálogo de Productos** - Visualización con filtros avanzados  
✅ **Carrito de Compras** - Agregar, modificar y eliminar productos  
✅ **Órdenes de Compra** - Crear y rastrear compras  
✅ **Arquitectura RESTful** - API bien estructurada  
✅ **Full Stack** - Frontend HTML/CSS/JS + Backend Node.js  

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express.js
- **Frontend**: HTML, CSS, JavaScript puro
- **Base de Datos**: MySQL (Sequelize ORM)
- **Validación**: HTTP methods y middleware

---

## 📦 Instalación

### Requisitos Previos
- **Node.js** v14+ ([Descargar](https://nodejs.org))
- **MySQL** ([Descargar](https://www.mysql.com/downloads/))
- **Git** (opcional)

### Paso 1: Clonar o Descargar el Proyecto
```bash
cd lab-node-sql
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Crear la Base de Datos
Abre MySQL y ejecuta:
```bash
mysql -u root -p < scriptDevMarket.sql
```

Cuando se solicite, ingresa tu contraseña de MySQL (si tienes una).

### Paso 4: Configurar Variables de Entorno
Edita el archivo `.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=devmarket
```

### Paso 5: Iniciar el Servidor
```bash
npm start
```

Deberías ver:
```
✅ Conexión a MySQL exitosa
✅ Modelos sincronizados
🚀 Servidor DevMarket en http://localhost:3000
```

---

## 🌐 Acceder a la Aplicación

Abre tu navegador en: **http://localhost:3000**

### Credenciales de Prueba
```
Email: juan@example.com
Contraseña: pass123
```

---

## 📚 Historias de Usuario Implementadas

### HU-01: Autenticación
- Registro de nuevos usuarios
- Inicio de sesión con validación
- Cierre de sesión
- Gestión de sesión con localStorage

### HU-02: Catálogo y Compra
- Visualización de 6+ productos
- Filtros por: Categoría, Tecnología, Dificultad
- Detalles completos de productos
- Carrito de compras funcional
- Generación de órdenes

---

## 🔌 Endpoints API

### Autenticación
```
POST   /api/auth/register     - Crear cuenta
POST   /api/auth/login        - Iniciar sesión
GET    /api/auth/profile/:id  - Obtener perfil
```

### Productos
```
GET    /api/products                  - Listar productos
GET    /api/products/:id              - Detalle
GET    /api/products/categories/all   - Categorías
GET    /api/products/technologies/all - Tecnologías
```

### Carrito
```
POST   /api/cart          - Agregar
GET    /api/cart/:userId  - Obtener
DELETE /api/cart/:id      - Eliminar
```

### Órdenes
```
POST   /api/orders           - Crear
GET    /api/orders/user/:id  - Listar
```

---

## 🗂️ Estructura del Proyecto

```
lab-node-sql/
├── models/              # Modelos Sequelize
├── controllers/         # Lógica de negocio
├── routes/             # Rutas API
├── frontend/           # HTML, CSS, JS
├── server.js           # Punto de entrada
├── package.json        # Dependencias
├── .env                # Variables de entorno
├── scriptDevMarket.sql # Script BD
└── REQUIREMENTS.md     # Documento de requerimientos
```

---

## 🧪 Pruebas

**Con Postman:**
1. Importar colección (si disponible) o crear requests manualmente
2. Usar endpoints listados arriba
3. Ver respuestas en JSON

**Con curl (línea de comandos):**
```bash
# Obtener productos
curl http://localhost:3000/api/products

# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"Email":"test@example.com","FullName":"Test","Password":"pass123","PasswordConfirm":"pass123"}'
```

---

## 📋 Datos de Prueba Iniciales

El script `scriptDevMarket.sql` crea:
- 1 usuario admin
- 3 usuarios clientes
- 6 categorías
- 6 productos de ejemplo

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'express'"
```bash
npm install
```

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
- Asegúrate que MySQL está corriendo
- Verifica credenciales en `.env`
- Puerto correcto (3306 es el estándar)

### Error: "database does not exist"
```bash
mysql -u root -p < scriptDevMarket.sql
```

### Puerto 3000 ya está en uso
Cambia el puerto en `.env`:
```
PORT=3001
```

---

## 📖 Documentación Adicional

- [REQUIREMENTS.md](./REQUIREMENTS.md) - Documento técnico completo
- [test.http](./test.http) - Ejemplos de requests

---

## ✅ Checklist pre-entrega

- [x] Autenticación funcionando
- [x] Productos con filtros
- [x] Carrito de compras
- [x] Órdenes de compra
- [x] Frontend responsive
- [x] API RESTful
- [x] Base de datos relacional
- [x] Documentación completa

---

## 👨‍💻 Autor

DevMarket - Proyecto de demostración Full Stack con Node.js 

**Fecha:** Febrero 2026

---

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al desarrollador.

---

**¡Gracias por usar DevMarket! 🚀**
