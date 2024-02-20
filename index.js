/**
 * Entry point of the application.
 * It exports all NetGet tools.
 * @module index
 */

// Log the successful loading of NetGet
console.log("NetGet Loaded Successfully.");

/**
 * Gateway class for handling domain-based routing and server initialization.
 * @see Gateway
 */
export { default as Gateway } from './src/gateway.js';