// startGateway.js
import NetGet from 'netget';
import { routes } from 'home/admin/.get/Gateways/routes.js'; 
const netget = new NetGet();
const gateway = netget.Gateway({ routes: routes });
gateway.listen();

