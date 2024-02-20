/*
🅜🅞🅝🅐🅓🅛🅘🅢🅐
🅃🄷🄴🄶🄰🅃🄴🅆🄰🅈    
ⓝⓔⓤⓡⓞⓝⓢ.ⓜⓔ
🄽🄴🅃🄶🄴🅃
🆂🆄🅸🅶🅽
*/
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

/**
 * Represents a gateway server with customizable settings.
 */
class Gateway {
    /**
     * Initializes a new instance of the Gateway class.
     * @param {Object} config - Configuration options for the server.
     * @param {number} [config.port=3000] - The port number on which the server will listen.
     * @param {string} [config.domainsConfigPath='./config/domains.json'] - Path to the domains configuration file.
     */
    constructor({ port = 3000, domainsConfigPath = './config/domains.json' } = {}) {
        this.port = port;
        // Resolve the absolute path to the configuration file
        this.domainsConfigPath = path.join(path.dirname(fileURLToPath(import.meta.url)), domainsConfigPath);
        this.app = express();
        this.initialize().catch(err => console.error('Initialization error:', err));
    }

    /**
     * Asynchronously initializes the server, setting up static file serving, view engine, and domain routing.
     */
    async initialize() {
        // Calculate the base directory for the gateway, assuming the gateway class is in 'src'
         const baseDir = path.dirname(fileURLToPath(import.meta.url));
         this.app.use(express.static(path.join(baseDir, 'ejsApp', 'public')));
         this.app.set('view engine', 'ejs');
         this.app.set('views', path.join(baseDir, 'ejsApp', 'views'));
         this.app.use(morgan('dev')); // 'dev' is a predefined format string in Morgan
         // Define a route handler for the root path to render the index.ejs view
         this.app.get('/', (req, res) => {
            res.render('index', { title: 'Gateway Initiated.' });
        });
        await this.loadDomainConfig();
    }

    /**
     * Asynchronously loads the domain configuration from the specified JSON file.
     */
    async loadDomainConfig() {
        try {
            const config = JSON.parse(await fs.readFile(this.domainsConfigPath, 'utf-8'));
            console.log('Loaded Domain Configuration:', config);
        } catch (err) {
            console.error('Failed to load domain configuration:', err);
            throw new Error('Failed to initialize domain configuration');
        }
    }

    /**
     * Starts the server, making it listen on the configured port.
     */
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Gateway listening at http://localhost:${this.port}`);
            // Potentially log more about the loaded configuration
        });
    }
}

export default Gateway;




