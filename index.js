const http = require('http');
class Netget {
  constructor(host, port, protocol) {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
    this.server = null; // We'll store our server instance here
  }

  listen() {
    switch (this.protocol) {
      case 'http':
        // Create and listen on an HTTP server
        this.server = http.createServer((req, res) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Hello, World!\n');
        });
        this.server.listen(this.port, this.host, () => {
          console.log(`HTTP server listening at http://${this.host}:${this.port}`);
        });
        break;
      case 'ssh':
        // Create and listen on an SSH server
        // ...
        break;
      // More cases for other protocols...
      default:
        throw new Error(`Unsupported protocol: ${this.protocol}`);
    }
  }

  close() {
    // Close the server
    if (this.server) {
      this.server.close(() => {
        console.log('Server has been closed');
      });
    }
  }
}

module.exports = Netget;
