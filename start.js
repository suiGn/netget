const netget = require('./index.js');
// Start the server
const start = () => {
netget.listen(3111);
};

start();