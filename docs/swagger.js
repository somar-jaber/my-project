const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "Authentication routes documentation",
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}/api`,
            description: "Local server",
        },
    ],
    components: {
      schemas: {
        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@mail.com" },
            password: { type: "string", example: "12345678" },
          },
        },
        Register: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "somar" },
            email: { type: "string", example: "user@mail.com" },
            password: { type: "string", example: "12345678" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
