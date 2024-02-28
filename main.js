'use strict'

const fastify = require('fastify')({
    exposeHeadRoutes: true,
    logger: true
});

/** utils */
const errorCodes = require('fastify').errorCodes;

const path = require('path');

const queryLoader = require('./utils/queryLoader');
const queryManager = queryLoader('./database/queries.sql');

const crypto = require('crypto');
/** */

/** config */
const serverConfig = require('./server-config.json');
const databaseConfig = require('./database/database-config.json');
/** */

/** decorate */
fastify.decorate('queryManager', queryManager);
fastify.decorate('crypto', crypto);
/** */

/** module plug-in */
fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
});

fastify.register(require('@fastify/mysql'), {
    promise: true,
    connectionString: databaseConfig.CONNECTION.STRING,
    connectionLimit: databaseConfig.CONNECTION.LIMIT
});

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'build'),
    prefix: '/'
});
/** */

/** api plug-in */
fastify.register(require('./api/customer'));
fastify.register(require('./api/transaction'));
fastify.register(require('./api/sales'));
fastify.register(require('./api/trade'));
fastify.register(require('./api/search'));
/** */

fastify.setErrorHandler((error, request, reply) => {
    if(error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
        switch(error.statusCode) {
            case 500:
                reply.status(500)
                this.log.error(error);
                break;
            default:
                this.log.error(error);
        }
    }
});

fastify.listen({ port: serverConfig.PORT, host: serverConfig.HOST }, 
    (error, address) => {
        if(error) {
            fastify.log.error(error);
            process.exit(1);
        }
    }
);