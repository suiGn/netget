// startGateway.js
import NetGet from 'netget';
const netget = new NetGet();
const gateway = netget.Gateway();
gateway.listen();

