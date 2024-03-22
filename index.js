/**
 * Entry point of the application.
 * default exports NetGet
 * 
 * @module index
 */

import NetGet from './src/netget.js';
export { defaultHandler } from './src/routes/defaultHandlers.js';
export default NetGet;
console.log("NetGet Loaded.");