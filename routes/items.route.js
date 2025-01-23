const items = require('../Items');

// Options for get all items
const getItemsOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        // id: { type: 'string' },
                        name: { type: 'string' },
                    },
                },
            },
        },
    },
};

const getItemOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                },
            },
        },
    },
};

function itemsRoutes(fastify, options, done) {
    // Get all items
    fastify.get('/items', getItemsOptions, async (req, reply) => {
        reply.send(items);
    });

    // Get single item
    fastify.get('/items/:id', getItemOpts, async (req, reply) => {
        const { id } = req.params;

        const item = items.find(item => item.id === id);

        reply.send(item);
    });

    done();
}

module.exports = itemsRoutes;
