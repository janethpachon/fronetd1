// controllers/authController.js
const { User } = require("../models");
const crypto = require("crypto");

// Función para hashear contraseñas (simple para el ejercicio)
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Registro de usuario - HU-01
exports.register = async (req, res) => {
  try {
    const { Email, FullName, Password, PasswordConfirm } = req.body;

    // Validaciones
    if (!Email || !FullName || !Password || !PasswordConfirm) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (Password !== PasswordConfirm) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { Email } });
    if (userExists) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Crear usuario
    const newUser = await User.create({
      Email,
      FullName,
      Password: hashPassword(Password),
      Role: "client",
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        UserID: newUser.UserID,
        Email: newUser.Email,
        FullName: newUser.FullName,
        Role: newUser.Role,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Inicio de sesión - HU-01
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña requeridos" });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { Email } });

    if (!user) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    // Verificar contraseña
    const hashedPassword = hashPassword(Password);
    if (user.Password !== hashedPassword) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    // Para esta versión simple, retornar datos del usuario (en prod usar JWT)
    res.status(200).json({
      message: "Login exitoso",
      user: {
        UserID: user.UserID,
        Email: user.Email,
        FullName: user.FullName,
        Role: user.Role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["Password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};
