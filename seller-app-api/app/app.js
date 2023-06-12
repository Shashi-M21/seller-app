import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import http from 'http';
import debug from 'debug';
import { getRoutes } from 'get-routes';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import config from './lib/config/index.js';
import Mailer from './lib/mailer/index.js';
import db from './models/index.js'
import ondcRoutes from './routes/ondc.routes.js';
import productRoutes from './routes/product.routes.js';
import logisticRoutes from './routes/logistic.routes.js';
import categoryRoutes from './routes/category.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mailer = new Mailer();
const app = express();

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || config.get('express').port || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Enable Cross Origin Resource Sharing to whitelist origins
 */
const whitelist = config.get('cors').whitelistUrls;
const corsOptions = {
  origin: (origin, callback) => {
    if (!whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  exposedHeaders: 'set-cookie',
  credentials: true,
};


app.use(logger('dev'));

/**
 * Log http request details
 */
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Application REST APIs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.disable('etag');

// Error handler
app.use((err, req, res, next) => {
  // Send an exception email to dev users
  const exceptionEmailRecipients = config.get('general').exceptionEmailRecipientList;
  mailer.exceptionEmail({ receivers: exceptionEmailRecipients, data: { err } }).send();

  console.log('errr--------------->', err);
  // If no custom error is thrown, return 500 (server side error/exception)
  res.status(500).json({ error: 'Something went wrong. Please try again' });
});

(async () => {
  try {
    // Wait for the DB connection to setup and initialize the DB models

    // Register routes once the DB models are registered
    app.use('/api', cors(corsOptions), ondcRoutes);
    app.use('/api', cors(corsOptions), categoryRoutes);
    app.use('/api', cors(corsOptions), productRoutes);
    app.use('/api', cors(corsOptions), logisticRoutes);
    const routeDetails = getRoutes(app);
    console.log('Registered API paths are: \n', routeDetails);

    // Listen on provided port, on all network interfaces
    server.listen(port, () => {
      console.log('Express server listening at: ' + config.get('express').apiUrl);
    });
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Let Sequelize synchronize the database
     */
    await db.sequelize.sync();

    // Bootstrap();
  } catch (expressStartupError) {
    // logger.info('[server.js] Express startup failed. expressStartupError: ', {tagMetaData: {expressStartupError}});
  }
})();

function normalizePort(val) {
  const port = parseInt(val, 10);
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
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
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
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

export default app;
