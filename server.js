const fastify = require('fastify')({ logger: true });
const PORT = 3001;

fastify.register(require('./routes/items.route'));

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();
