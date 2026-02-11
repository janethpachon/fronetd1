// controllers/productsIaController.js
const { Product } = require("../models");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Obtener información de todos los productos para contexto
async function getProductsContext() {
  try {
    const products = await Product.findAll({
      attributes: ["ProductID", "ProductName", "Description", "Price", "Technology", "DifficultyLevel", "CategoryID"],
    });

    return products.map(p => ({
      id: p.ProductID,
      nombre: p.ProductName,
      descripcion: p.Description,
      precio: p.Price,
      tecnologia: p.Technology,
      dificultad: p.DifficultyLevel,
    }));
  } catch (error) {
    console.error("Error al obtener contexto de productos:", error);
    return [];
  }
}

// Consultar IA sobre productos
exports.askProductsIA = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Por favor, escribe una pregunta" });
    }

    // Obtener productos como contexto
    const products = await getProductsContext();

    if (products.length === 0) {
      return res.status(400).json({ error: "No hay productos disponibles" });
    }

    // Preparar contexto para la IA
    const productContext = products
      .map(
        p =>
          `- ${p.nombre} (ID: ${p.id}): ${p.descripcion}. Precio: $${p.precio}, Tecnología: ${p.tecnologia}, Dificultad: ${p.dificultad}`
      )
      .join("\n");

    const systemPrompt = `Eres un asistente experto en productos digitales para desarrolladores. 
Tu base de datos contiene los siguientes productos:

${productContext}

Responde preguntas sobre estos productos de manera útil y clara. 
Si alguien pregunta por un producto específico, proporciona información detallada.
Si preguntan recomendaciones, sugerencia los productos más relevantes basado en su pregunta.
Responde siempre en español.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer =
      completion.choices[0].message.content ||
      "No se pudo obtener respuesta de la IA";

    res.status(200).json({
      question,
      answer,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error en consulta a IA:", error);

    if (error.code === "invalid_api_key") {
      return res.status(401).json({
        error: "API Key de OpenAI inválida o no configurada",
      });
    }

    if (error.code === "rate_limit_exceeded") {
      return res.status(429).json({
        error: "Límite de requests a OpenAI excedido. Intenta más tarde.",
      });
    }

    res.status(500).json({
      error: "Error al procesar la consulta con IA",
      details: error.message,
    });
  }
};

// Sugerencias de IA basadas en preferencias
exports.getProductRecommendations = async (req, res) => {
  try {
    const { technology, difficulty } = req.query;

    let products = await Product.findAll();

    // Filtrar si se especifican criterios
    if (technology) {
      products = products.filter(p => p.Technology === technology);
    }
    if (difficulty) {
      products = products.filter(p => p.DifficultyLevel === difficulty);
    }

    if (products.length === 0) {
      return res.status(404).json({
        error: "No se encontraron productos con esos criterios",
      });
    }

    const productContext = products
      .map(
        p =>
          `${p.ProductName}: ${p.Description} ($${p.Price})`
      )
      .join("\n");

    const systemPrompt = `Eres un experto en desarrollo de software y recomendador de productos digitales.
Analiza estos productos y proporciona una recomendación breve pero útil:

${productContext}

Responde en máximo 2 párrafos explicando cuál es la mejor opción y por qué. Responde en español.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Basándote en estos productos, ¿cuál me recomiendas y por qué?`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const recommendation = completion.choices[0].message.content;

    res.status(200).json({
      products: products.map(p => ({
        id: p.ProductID,
        name: p.ProductName,
        price: p.Price,
        technology: p.Technology,
        difficulty: p.DifficultyLevel,
      })),
      recommendation,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error en recomendaciones:", error);
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
};
