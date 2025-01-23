const fastify = require('fastify')({ logger: true });
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');
const PORT = 3001;

// Register Swagger plugin
fastify.register(swagger, {
    swagger: {
        info: {
            title: 'Fastify API',
            description: 'Fastify API documentation',
            version: '1.0.0',
        },
        host: `localhost:${PORT}`,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    },
});

// Optionally, register Swagger UI to expose documentation in a user-friendly format
fastify.register(swaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'list', // Can be 'none', 'list', or 'full'
    },
    staticCSP: true,
    transformStaticCSP: header => header,
});

// Register your routes
fastify.register(require('./routes/items.route'));

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();
