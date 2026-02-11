-- Script para crear la base de datos DevMarket
-- DevMarket: Plataforma digital de productos para desarrolladores

DROP DATABASE IF EXISTS devmarket_db;
CREATE DATABASE devmarket_db CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE devmarket_db;

-- Tabla de Usuarios (Clientes y Administradores)
CREATE TABLE users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Email VARCHAR(100) UNIQUE NOT NULL,
  FullName VARCHAR(100) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Role ENUM('admin', 'client') DEFAULT 'client',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (Email),
  INDEX idx_role (Role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Tabla de Categorías de Productos
CREATE TABLE categories (
  CategoryID INT AUTO_INCREMENT PRIMARY KEY,
  CategoryName VARCHAR(100) UNIQUE NOT NULL,
  Description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (CategoryName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Tabla de Productos Digitales
CREATE TABLE products (
  ProductID INT AUTO_INCREMENT PRIMARY KEY,
  ProductName VARCHAR(150) NOT NULL,
  Description TEXT,
  Price DECIMAL(10, 2) NOT NULL,
  Technology VARCHAR(100) COMMENT 'e.g., React, Vue, Node.js, Java, Python',
  DifficultyLevel ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  CategoryID INT NOT NULL,
  AdminID INT,
  FileURL VARCHAR(255) COMMENT 'URL o ruta del archivo descargable',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (CategoryID) REFERENCES categories (CategoryID) ON DELETE CASCADE,
  FOREIGN KEY (AdminID) REFERENCES users (UserID) ON DELETE SET NULL,
  INDEX idx_category (CategoryID),
  INDEX idx_technology (Technology),
  INDEX idx_difficulty (DifficultyLevel),
  INDEX idx_admin (AdminID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Tabla de Carrito de Compras
CREATE TABLE carts (
  CartID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  ProductID INT NOT NULL,
  Quantity INT DEFAULT 1,
  AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (UserID) REFERENCES users (UserID) ON DELETE CASCADE,
  FOREIGN KEY (ProductID) REFERENCES products (ProductID) ON DELETE CASCADE,
  INDEX idx_user (UserID),
  INDEX idx_product (ProductID),
  UNIQUE KEY unique_cart (UserID, ProductID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Tabla de Órdenes de Compra
CREATE TABLE orders (
  OrderID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  TotalAmount DECIMAL(10, 2) NOT NULL,
  Status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserID) REFERENCES users (UserID) ON DELETE CASCADE,
  INDEX idx_user (UserID),
  INDEX idx_status (Status),
  INDEX idx_date (OrderDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Tabla de Items de la Orden
CREATE TABLE order_items (
  OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
  OrderID INT NOT NULL,
  ProductID INT NOT NULL,
  Price DECIMAL(10, 2) NOT NULL COMMENT 'Precio al momento de la compra',
  FOREIGN KEY (OrderID) REFERENCES orders (OrderID) ON DELETE CASCADE,
  FOREIGN KEY (ProductID) REFERENCES products (ProductID) ON DELETE CASCADE,
  INDEX idx_order (OrderID),
  INDEX idx_product (ProductID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- DATOS DE PRUEBA
-- Insertar usuarios (admin y clientes)
INSERT INTO users (Email, FullName, Password, Role) VALUES
('admin@devmarket.com', 'Admin DevMarket', SHA2('admin123', 256), 'admin'),
('juan@example.com', 'Juan Pérez', SHA2('pass123', 256), 'client'),
('maria@example.com', 'María García', SHA2('pass123', 256), 'client'),
('carlos@example.com', 'Carlos López', SHA2('pass123', 256), 'client');

-- Insertar categorías
INSERT INTO categories (CategoryName, Description) VALUES
('Plantillas HTML/CSS', 'Plantillas profesionales de sitios web'),
('Snippets JavaScript', 'Fragmentos de código reutilizables'),
('APIs REST', 'Servicios web completos'),
('Mini Proyectos', 'Proyectos pequeños funcionales'),
('Componentes React', 'Componentes reutilizables para React'),
('Tutoriales', 'Guías y tutoriales técnicos');

-- Insertar productos de ejemplo
INSERT INTO products (ProductName, Description, Price, Technology, DifficultyLevel, CategoryID, AdminID, FileURL) VALUES
('Landing Page Pro', 'Plantilla de landing page moderna y responsiva', 19.99, 'HTML/CSS/JS', 'beginner', 1, 1, '/uploads/landing-page-pro.zip'),
('Dashboard Admin', 'Panel administrativo completo con gráficos', 49.99, 'React', 'intermediate', 5, 1, '/uploads/dashboard-admin.zip'),
('API RESTful Node.js', 'API completa con autenticación y base de datos', 39.99, 'Node.js', 'intermediate', 3, 1, '/uploads/api-nodejs.zip'),
('Validación Formularios', 'Librería completa para validación de datos', 9.99, 'JavaScript', 'beginner', 2, 1, '/uploads/validacion-formularios.zip'),
('E-commerce Básico', 'Mini proyecto de tienda online', 29.99, 'React/Node.js', 'intermediate', 4, 1, '/uploads/ecommerce-basico.zip'),
('Sistema de Chat', 'Aplicación de mensajería en tiempo real', 59.99, 'Node.js/Socket.io', 'advanced', 4, 1, '/uploads/sistema-chat.zip');

-- Crear índices adicionales para reportes
CREATE INDEX idx_product_created ON products(createdAt);
CREATE INDEX idx_order_created ON orders(OrderDate);
