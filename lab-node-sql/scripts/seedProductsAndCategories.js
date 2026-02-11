// scripts/seedProductsAndCategories.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Category, Product, sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();

    const existingCats = await Category.count();
    if (existingCats === 0) {
      const categories = [
        { CategoryName: 'Plantillas HTML/CSS', Description: 'Plantillas profesionales de sitios web' },
        { CategoryName: 'Snippets JavaScript', Description: 'Fragmentos de código reutilizables' },
        { CategoryName: 'APIs REST', Description: 'Servicios web completos' },
        { CategoryName: 'Mini Proyectos', Description: 'Proyectos pequeños funcionales' },
        { CategoryName: 'Componentes React', Description: 'Componentes reutilizables para React' },
        { CategoryName: 'Tutoriales', Description: 'Guías y tutoriales técnicos' },
      ];

      const created = await Category.bulkCreate(categories);
      console.log('Categorías creadas:', created.map(c => c.CategoryName).join(', '));
    } else {
      console.log('Ya existen categorías en la base de datos.');
    }

    const existingProducts = await Product.count();
    if (existingProducts === 0) {
      // map category names to IDs
      const cats = await Category.findAll();
      const map = {};
      cats.forEach(c => map[c.CategoryName] = c.CategoryID);

      const products = [
        { ProductName: 'Landing Page Pro', Description: 'Plantilla de landing page moderna y responsiva', Price: 19.99, Technology: 'HTML/CSS/JS', DifficultyLevel: 'beginner', CategoryID: map['Plantillas HTML/CSS'] || 1, AdminID: 1, FileURL: '/uploads/landing-page-pro.zip' },
        { ProductName: 'Dashboard Admin', Description: 'Panel administrativo completo con gráficos', Price: 49.99, Technology: 'React', DifficultyLevel: 'intermediate', CategoryID: map['Componentes React'] || 5, AdminID: 1, FileURL: '/uploads/dashboard-admin.zip' },
        { ProductName: 'API RESTful Node.js', Description: 'API completa con autenticación y base de datos', Price: 39.99, Technology: 'Node.js', DifficultyLevel: 'intermediate', CategoryID: map['APIs REST'] || 3, AdminID: 1, FileURL: '/uploads/api-nodejs.zip' },
        { ProductName: 'Validación Formularios', Description: 'Librería completa para validación de datos', Price: 9.99, Technology: 'JavaScript', DifficultyLevel: 'beginner', CategoryID: map['Snippets JavaScript'] || 2, AdminID: 1, FileURL: '/uploads/validacion-formularios.zip' },
        { ProductName: 'E-commerce Básico', Description: 'Mini proyecto de tienda online', Price: 29.99, Technology: 'React/Node.js', DifficultyLevel: 'intermediate', CategoryID: map['Mini Proyectos'] || 4, AdminID: 1, FileURL: '/uploads/ecommerce-basico.zip' },
        { ProductName: 'Sistema de Chat', Description: 'Aplicación de mensajería en tiempo real', Price: 59.99, Technology: 'Node.js/Socket.io', DifficultyLevel: 'advanced', CategoryID: map['Mini Proyectos'] || 4, AdminID: 1, FileURL: '/uploads/sistema-chat.zip' },
      ];

      const createdP = await Product.bulkCreate(products);
      console.log('Productos creados:', createdP.map(p => p.ProductName).join(', '));
    } else {
      console.log('Ya existen productos en la base de datos.');
    }

  } catch (err) {
    console.error('Error seed:', err.message || err);
  } finally {
    await sequelize.close();
  }
})();
