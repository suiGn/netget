const express = require('express');

const startServer = (domain, port) => {
    const app = express();

    app.get('/', (req, res) => {
        res.send(`Welcome to ${domain}!`);
    });

    // Additional routes/logic as needed

    app.listen(port, () => {
        console.log(`Server is running at http://${domain}:${port}`);
    });
};

module.exports = startServer;
