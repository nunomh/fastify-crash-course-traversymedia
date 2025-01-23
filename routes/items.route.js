const { getItem, getItems, addItem, updateItem, deleteItem } = require('../controllers/items.controllers');

const Item = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
    },
};

// Options for get all items
const getItemsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: Item,
            },
        },
    },
    handler: getItems,
};

const getItemOpts = {
    schema: {
        response: {
            200: Item,
        },
    },
    handler: getItem,
};

const postItemOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['name'],
            properties: {
                name: { type: 'string' },
            },
        },
        response: {
            201: Item,
        },
    },
    handler: addItem,
};

const updateItemOpts = {
    schema: {
        response: {
            200: Item,
        },
    },
    handler: updateItem,
};

const deleteItemOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                },
            },
        },
    },
    handler: deleteItem,
};

function itemsRoutes(fastify, options, done) {
    // Get all items
    fastify.get('/items', getItemsOpts);

    // Get single item
    fastify.get('/items/:id', getItemOpts);

    // Add new item
    fastify.post('/items', postItemOpts);

    // Update an item
    fastify.put('/items/:id', updateItemOpts);

    // Delete an item
    fastify.delete('/items/:id', deleteItemOpts);

    done();
}

module.exports = itemsRoutes;
