const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kabadi Shop API",
      version: "1.0.0",
      description: "Scrap Management Backend APIs",
    },
    servers: [
      {
        url: "http://10.10.10.9:5000/api",
        description: "Local API",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  // 🔥 THIS PATH IS THE KEY
  apis: [path.join(__dirname, "../modules/**/*.routes.js")],
};

module.exports = swaggerJSDoc(options);
