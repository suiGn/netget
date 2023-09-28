// netget.js

class Netget {
    constructor(options = {}) {
        this.serverEndpoint = options.serverEndpoint || 'ws://localhost';
        this.domain = options.domain || 'domain';
        this.type = options.type || 'Service'; // Default type is Service
        this.socket = new WebSocket(this.serverEndpoint);
        
        this._init();
    }
    
    _init() {
        this.socket.addEventListener('open', () => {
            console.log(`Connected to ${this.serverEndpoint}`);
            
            // Send Handshake Initiation Message
            this.socket.send(JSON.stringify({
                type: 'handshake',
                domain: this.domain,
                nodeType: this.type
            }));
        });
        
        this.socket.addEventListener('message', (event) => {
            let msg = JSON.parse(event.data);
            if(msg.type === 'handshake-ack') {
                console.log(`Handshake acknowledged by ${this.serverEndpoint}`);
            }
        });
    }
}

// Exporting the Netget class
module.exports = Netget;