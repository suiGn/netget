import express from 'express';
import { loadDomainConfig } from '../config/domainConfigUtils.js'; // Adjust the import path as necessary

// Export a function that initializes the router
export default function initializeRoutes(domainsConfigPath) {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.render('index', { title: 'Gateway Initiated.' });
    });
    
    
    router.get('/domainList', async (req, res) => {
        try {
            const domainsConfig = await loadDomainConfig(domainsConfigPath);
            res.render('domainList', { domains: domainsConfig.domains });
        } catch (err) {
            console.error('Error loading domain configuration:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    // Define other routes...

    return router;
}


