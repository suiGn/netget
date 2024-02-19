import Gateway from '../src/Gateway.js';
// Configura aquí la ruta al archivo de configuración de dominios si es necesario
const gateway = new Gateway({
    port: 3000,
    domainsConfigPath: './config/domains.json'
});

gateway.listen();