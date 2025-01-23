# fastify API

Based on Traversy Media youtube video https://www.youtube.com/watch?v=Lk-uVEVGxOA

Fastify is a web framework for Node.js, like express.

#### Create project and Install dependencies

Init node project: `npm init -y`

Install dependencies: `npm install fastify uuid @fastify/swagger @fastify/swagger-ui`
Dev dependency: `npm i -D nodemon`

Update the package.json

```json
"main": "server.js",
"scripts": {
        "start": "node server",
        "dev": "nodemon server"
    }
```

Create the file server.js.
Simple server:

```js
const fastify = require('fastify')({ logger: true });
const PORT = 3001;

fastify.get('/items', async (req, reply) => {
    reply.send({ items: ['item1', 'item2'] });
});

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();
```

#### Routes folder

To separate the routes logic from the server.js file, create a folder called routes, then create a file for each route, for instance items.route.js

Update the server.js

```js
const fastify = require('fastify')({ logger: true });
const PORT = 3001;

fastify.register(require('./routes/items.route')); // here is the route register

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();
```

on the items.router.js

```js
const items = require('../Items');

function itemsRoutes(fastify, options, done) {
    // create a function with these params
    fastify.get('/items', async (req, reply) => {
        reply.send(items);
    });

    fastify.get('/items/:id', async (req, reply) => {
        const { id } = req.params;
        const item = items.find(item => item.id === id);
        reply.send(item);
    });

    done(); // call done()
}

module.exports = itemsRoutes; // don't forget to export
```

#### Schemas

You can define what the response will be and what data you will send with a schema

Example:

```js
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
                        // id: { type: 'string' }, // the id won't be on the resp
                        name: { type: 'string' },
                    },
                },
            },
        },
    },
};

function itemsRoutes(fastify, options, done) {
    // Get all items
    fastify.get('/items', getItemsOptions, async (req, reply) => {
        // pass here
        reply.send(items);
    });

    done();
}

module.exports = itemsRoutes;
```

You can create an object for that item an reuse that object.
Also, the controller can be passed as a handler. Both updates below:

```js
const items = require('../Items');

const Item = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
    },
};

// Options for get all items
const getItemsOptions = {
    schema: { // this schema is not mandatory but it's a good practice
        response: {
            200: {
                type: 'array',
                items: Item, // Item schema here
            },
        },
    },
    handler: (req, reply) => { // a new handler here
        reply.send(items);
    },
};

...

function itemsRoutes(fastify, options, done) {
    // Get all items
    fastify.get('/items', getItemsOptions); // move the function to the handler

    done();
}
module.exports = itemsRoutes;
```

#### Controllers

Create a new folder /controllers
Inside that folder create a new file called for instance items.controller.js
Create new functions and move the endpoint logic here

```jsx
const items = require('../Items');

const getItems = (req, reply) => {
    reply.send(items);
};

const getItem = (req, reply) => {
    const { id } = req.params;
    const item = items.find(item => item.id === id);
    reply.send(item);
};

module.exports = { getItems, getItem }; // don't forget to export
```

on the routes.js

```jsx
const { getItem, getItems } = require('../controllers/items.controllers');

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

function itemsRoutes(fastify, options, done) {
    // Get all items
    fastify.get('/items', getItemsOpts); // Get single item

    fastify.get('/items/:id', getItemOpts);

    done();
}

module.exports = itemsRoutes;
```

#### Body Validation

If you want to validate the data that's it's being sent to the endpoint or put some required fields, add the body to the schema:

```js
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
```

#### fastify-swagger

`npm i @fastify/swagger @fastify/swagger-ui`

Add to your server.js

```js
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');
...
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

```
