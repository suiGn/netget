// index.js
const express = require('express');
const axios = require('axios');  // Remember to install it.
const { registerWithRegistry } = require('./lib/networkManager');

const app = express();
const PORT = process.env.PORT || 3000;
const REGISTRY_URL = 'https://registry.netget.me'; // Placeholder for your registry

// Define a basic route
app.get('/', (req, res) => {
    res.send('Welcome to netget service node!');
});

app.get('/discover/:nodeName', async (req, res) => {
    // Use a placeholder in-memory store for simplicity
    const nodes = {
        YourNodeName: 'http://localhost:3000',
        // ... other nodes ...
    };

    const nodeAddress = nodes[req.params.nodeName];
    if (nodeAddress) {
        res.json({ address: nodeAddress });
    } else {
        res.status(404).json({ error: 'Node not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Service node started on http://localhost:${PORT}`);
    registerWithRegistry(REGISTRY_URL, PORT);  // Pass required parameters to the function.
});

