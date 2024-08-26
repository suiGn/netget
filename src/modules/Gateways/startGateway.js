// startGateway.js
import NetGet from '/home/bongi/netget/src/netget.js';
const netget = new NetGet();
const gateway = netget.Gateway();
gateway.listen();

