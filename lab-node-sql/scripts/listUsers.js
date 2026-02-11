// scripts/listUsers.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { User, sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({ attributes: ['UserID', 'Email', 'FullName', 'Role'] });
    console.log('Usuarios en la base de datos:');
    users.forEach(u => console.log(u.toJSON()));
  } catch (err) {
    console.error('Error listando usuarios:', err.message || err);
  } finally {
    await sequelize.close();
  }
})();
