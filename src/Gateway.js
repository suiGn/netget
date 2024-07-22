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
 * The Gateway class is a customizable gateway that allows you to define routes for different domains.
 * The routes are defined as an object mapping domain names to request handlers.
 * The gateway listens on a specified port and host, and routes requests based on the domain name.
 * If no specific route is found for a domain, a default route is used.
 * The gateway also serves static files and logs requests using morgan.
 * The configuration for the gateway can be provided through an object or environment variables.
 * The default configuration values are:
 * host: 'localhost'
 * port: 3432
 * routes: {}
 * domainsConfigPath: '~/.get/domains.json'
 * The gateway uses express as the underlying web server framework.
 * To use the gateway, create an instance of the Gateway class and call the listen method.
 * Example:
 * const gateway = new netget.Gateway({
 *  host: 'localhost',
 * port: 3000,
 * routes: {
 * 'example.com': (req, res) => {
 * res.send('Hello from example.com!');
 * },
 * 'sub.example.com': (req, res) => {
 * res.send('Hello from sub.example.com!');
 * },
 * },
 * });
 * gateway.listen();
 * The example above creates a gateway listening on port 3000 with routes for example.com and sub.example.com.
 * The routes respond with different messages based on the domain name.
 ***********************/
class Gateway {
   /**
   * Initializes a new instance of the Gateway class.
   * @param {Object} config - The configuration object for the gateway.
   * @param {Object} [config.host='localhost']  - The host name on which the gateway will listen.
   * @param {number} [config.port=3432] - The port number on which the gateway will listen.
   * @param {Object} [config.routes={}] - An object mapping domains to their respective request handlers.
   * @param {string} [config.domainsConfigPath='~/.get/domains.json'] - The path to the domains configuration file.
   */
  constructor({   
    host = process.env.HOST || 'localhost', 
    port = process.env.NETGET_PORT || 3432, 
    routes = {},
    domainsConfigPath = process.env.DOMAINS_CONFIG_PATH || '~/.get/domains.json' 
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
      const fullUrl = `${req.hostname || req.headers['host']}${req.url}`;
      let handler = null;
  
      // Check for exact match first (full URL)
      Object.keys(this.routes).some(pattern => {
          const regexPattern = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`); // Convert pattern to regex, replacing * with .*
          if (regexPattern.test(fullUrl)) {
              handler = this.routes[pattern];
              return true; // Stop iteration once match is found
          }
          return false;
      });
  
      // If no handler found, check if there's a more general match or use default
      if (!handler) {
          // Extract hostname for broader match
          const hostname = req.hostname || req.headers['host'];
          Object.keys(this.routes).some(pattern => {
              if (pattern === hostname) {
                  handler = this.routes[pattern];
                  return true;
              } else if (pattern.startsWith('*.')) {
                  const baseDomain = pattern.slice(2);
                  if (hostname.endsWith(baseDomain) && (hostname.split('.').length === baseDomain.split('.').length + 1)) {
                      handler = this.routes[pattern];
                      return true;
                  }
              }
              return false;
          });
      }
  
      // Fallback to default if no specific handler is found
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
