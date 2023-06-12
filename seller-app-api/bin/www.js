#!/usr/bin/env node

/**
 * Module dependencies.
 */
// var app = require('./app/app.js');
import app from '../app/app.js'
import debug from 'debug';
// var debug = require('debug')('genA-sdk:server');
// var http = require('http');
import http from 'http'
// import debug from 'debug';

import config from '../app/lib/config/index.js'
// var config = require('../app/lib/config/index.js');
// var {sequelize} = require('../app/models/index.js');
import db from '../app/models/index.js'
import bootstrapData from '../app/lib/bootstrap/index.js'
// var bootstrapData = require('../app/lib/bootstrap/index.js').default;


// const Redis = require("ioredis");
// global.redisCache = new Redis(config.get('redis').port,config.get('redis').host);

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.get("express").port || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Let sequalize synchronize the database
 */
db.sequelize.sync().then(function () {
     /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port, function () {
        console.log("Express server listening at: " + config.get("express").apiUrl)
    });
    server.on('error', onError);
    server.on('listening', onListening);

//     /**
//      * Bootstrap system Roles, Templates, Users
//      */
//     bootstrapData();
//
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
