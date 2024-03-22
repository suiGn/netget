//src/gateway.js
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import defaultRoutes from './routes/defaultRoutes.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import chalk from 'chalk';
// Determine the base directory for static file serving and view engine setup8
const baseDir = path.dirname(fileURLToPath(import.meta.url));
/***********************
 * Customizable Gateway.*
 ***********************/
class Gateway {
   /**
   * Initializes a new instance of the Gateway class.
   * @param {Object} config - The configuration object for the gateway.
   * @param {Object} [config.host='localhost']  - The host name on which the gateway will listen.
   * @param {number} [config.port=3432] - The port number on which the gateway will listen.
   * @param {Object} [config.routes={}] - An object mapping domains to their respective request handlers.
   * @param {string} [config.domainsConfigPath='./config/domains.json'] - The path to the domains configuration file.
   */
  constructor({   
    host = process.env.HOST || 'localhost', 
    port = process.env.NETGET_PORT || 3432, 
    routes = {},
    domainsConfigPath = process.env.DOMAINS_CONFIG_PATH || './config/domains.json' 
  } = {}) {
    this.host = host;
    this.port = port;
    this.routes = routes;
    this.domainsConfigPath = domainsConfigPath;
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
      if (!fs.existsSync(this.domainsConfigPath)) {
        console.error(chalk.yellow('Domains Configuration File Not Found.',
        '\n','Please provide a valid path @ .env Line DOMAINS_CONFIG_PATH=...'));
        //process.exit(1); // Exit if the configuration file doesn't exist
      }

    morgan.token('host', (req) => req.hostname || req.headers['host'] || '-');
    this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms - Host: :host'));


    this.app.use((req, res) => {
      const hostname = req.hostname || req.headers['host'];
      let handler = null;
      // Iterate over the routes to find a match
      Object.keys(this.routes).forEach(pattern => {
        if (pattern === hostname) {
          // Direct hostname match
          handler = this.routes[pattern];
        } else if (pattern.startsWith('*.')) {
          // Wildcard domain match
          const baseDomain = pattern.slice(2);
          if (hostname.endsWith(baseDomain) && (hostname.split('.').length === baseDomain.split('.').length + 1)) {
            handler = this.routes[pattern];
          }
        }
      });
      // Use the found handler or fallback to default
      handler = handler || defaultRoutes;
      handler(req, res);
    });

    
  }
  /**
   * Starts the gateway, making it listen on the configured port.
   */
  listen() {
    this.app.listen(this.port, this.host, () => {
      console.log(chalk.green(`Gateway listening at http://${this.host}:${this.port}`));
    });
  }
}
export default Gateway;
