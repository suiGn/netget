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
import initializeRoutes from './routes/routes.js';
import { loadDomainConfig } from './config/domainConfigUtils.js';

// Calculate the equivalent of __dirname in ES Module scope
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Class representing a customizable gateway server using Express.js.
 */
class Gateway {
    /**
     * Creates a Gateway instance with provided configuration.
     * @param {Object} config Configuration for the Gateway.
     * @param {number} [config.port=3000] Port on which the server will listen.
     * @param {string} [config.domainsConfigPath='./config/domains.json'] Path to the domain configuration file.
     */
    constructor({ port = 3000, domainsConfigPath = './config/domains.json' } = {}) {
        this.port = port;
        // Adjust the path to the domains configuration file
        this.domainsConfigPath = path.resolve(__dirname, domainsConfigPath);
        this.app = express();
        this.initialize().catch(err => console.error('Initialization error:', err));
    }

    /**
     * Initializes the server setup including static file serving, view engine setup, and domain routing.
     */
    async initialize() {
     // Calculate the base directory for the gateway, assuming the gateway class is in 'src'
     const baseDir = path.dirname(fileURLToPath(import.meta.url));
     this.app.use(express.static(path.join(baseDir, 'ejsApp', 'public')));
     this.app.set('view engine', 'ejs');
     this.app.set('views', path.join(baseDir, 'ejsApp', 'views'));
        // Use morgan for logging
        this.app.use(morgan('dev'));
    
        // Load the domain configuration
        await this.loadDomainConfig();
    
        // Initialize and use the routes with the provided domainsConfigPath
        // This should come after loading your domain configuration and before starting the server
        const router = initializeRoutes(this.domainsConfigPath);
        this.app.use(router);
    }

    /**
     * Loads the domain configuration from a specified JSON file.
     */
    async loadDomainConfig() {
        try {
            // Pass the resolved path to the utility function
            const config = await loadDomainConfig(this.domainsConfigPath);
            console.log('Loaded Domain Configuration:', config);
        } catch (err) {
            console.error('Failed to load domain configuration:', err);
            throw new Error('Failed to initialize domain configuration');
        }
    }

    /**
     * Starts listening on the configured port.
     */
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Gateway listening at http://localhost:${this.port}`);
        });
    }
}

export default Gateway;

