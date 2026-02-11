// scripts/seedDemoUser.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { User, sequelize } = require('../models');
const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

(async () => {
  try {
    await sequelize.authenticate();
    const email = 'juan@example.com';
    const existing = await User.findOne({ where: { Email: email } });
    if (existing) {
      console.log('Usuario demo ya existe:', existing.Email);
      process.exit(0);
    }

    const user = await User.create({
      Email: email,
      FullName: 'Juan Pérez',
      Password: hashPassword('pass123'),
      Role: 'client',
    });

    console.log('Usuario demo creado:', user.Email);
  } catch (err) {
    console.error('Error creando usuario demo:', err.message || err);
  } finally {
    await sequelize.close();
  }
})();
