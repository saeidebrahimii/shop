const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shop API',
      version: '1.0.0',
      description: 'A simple shop API with Swagger documentation',
    },
  },
  apis: ['modules/**/*.swagger.js'], // Path to your API routes
};
const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};