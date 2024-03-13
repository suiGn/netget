import express from 'express';

import fs from 'fs/promises'; // Ensure fs is imported for file operations
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

 // Endpoint to add a new domain
 router.post('/addDomain', async (req, res) => {
    console.log(req.body); // Check to see if the data is coming through
    const { domain, handler, state } = req.body;
    // Rest of your logic...
});


    // Define other routes...

    return router;
}


