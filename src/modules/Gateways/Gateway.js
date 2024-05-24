//netget/src/modules/Gateways/Gateway.js
import NetGet from 'netget';
import { routes } from '~/.get/routes.js'; // Adjust the path to your global .get directory
const netget = new NetGet();
const gateway = netget.Gateway({ routes: routes });
gateway.listen();
