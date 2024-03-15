import express from 'express';
import path from 'path';
import morgan from 'morgan';
import defaultRoutes from './routes/defaultRoutes.js';
import { fileURLToPath } from 'url';

// Determine the base directory for static file serving and view engine setup
const baseDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Represents a customizable gateway server.
 */
class Gateway {
  /**
   * Initializes a new instance of the Gateway class.
   * @param {Object} config - The configuration object for the gateway.
   * @param {number} [config.port=3432] - The port number on which the gateway will listen.
   * @param {Object} [config.handlers={}] - An object mapping domains to their respective request handlers.
   */
  constructor({ port = 3432, routes = {} } = {}) {
    this.port = port;
    this.routes = routes;
    this.app = express();
    this.initialize().catch(err => console.error('Initialization error:', err));
  }

  /**
   * Initializes the express application with middleware, static file serving, and view engine setup.
   */
  async initialize() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(path.join(baseDir, 'ejsApp', 'public')));
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(baseDir, 'ejsApp', 'views'));
    morgan.token('host', (req) => req.hostname || req.headers['host'] || '-');
    this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms - Host: :host'));
  
    /* This middleware checks the request's ::::::::hostname::::::and uses the corresponding handler or the default one.

 Hard-coded and Dynamic Domain Handling in the Gateway  , 
        Define two methods. 
        1. Static object this.handlers for domains with predefined handlers. 
        2. Fetch Handler configurations dynamically from a PostgreSQL database v.path.mlisa.me,
         for domains that require dynamic content serving, such as browser.pixelgrid.me/html.js.
   
    this.app.use((req, res) => {
        // Check if handlers object is empty (no handlers defined at all)
        const noHandlersDefined = Object.keys(this.handlers).length === 0;
        const handler = this.handlers[req.hostname] || ((req, res) => defaultHandler(req, res, noHandlersDefined));
        handler(req, res);
      });
  }
*/
    this.app.use((req, res) => {
      // Check if handlers object is empty (no handlers defined at all)
      const noRoutesDefined = Object.keys(this.handlers).length === 0;
      const routes = this.routes[req.hostname] || ((req, res) => defaultRoutes(req, res, noHRoutesDefined));
      handler(req, res);
    });
  }
  /**
   * Starts the gateway, making it listen on the configured port.
   */
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Gateway listening at http://localhost:${this.port}`);
    });
  }
}

export default Gateway;
