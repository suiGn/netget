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
    const { domain, handler } = req.body;
    try {
        const domainsConfig = await loadDomainConfig(domainsConfigPath);
        domainsConfig.domains[domain] = handler; // Add the new domain
        await fs.writeFile(domainsConfigPath, JSON.stringify(domainsConfig, null, 2)); // Ensure path is correct
        res.redirect('/domainList'); // Redirect back to the domain list
    } catch (err) {
        console.error('Failed to add domain:', err);
        res.status(500).send('Error adding domain');
    }
});

    // Define other routes...

    return router;
}


