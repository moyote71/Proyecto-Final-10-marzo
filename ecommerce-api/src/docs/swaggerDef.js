import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API Documentación',
      version: '1.0.0',
      description: 'Documentación interactiva de la API del proyecto E-commerce. Incluye autenticación mediante Cookies (HTTP-Only) para las rutas protegidas.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}/api`,
        description: 'Servidor de Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT Token via HTTP-Only Cookie',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Lee las anotaciones JSDoc de las rutas
};

export const swaggerSpec = swaggerJsdoc(options);
