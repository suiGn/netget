<img src="./_._.svg" alt="SVG Image" width="123" height="123" style="width123px; height:123px;">

# Netget Protocol

The Netget Protocol is designed to facilitate real-time communication between **web clients and servers using a handshaker** mechanism. It enables seamless and secure information exchanges and can be readily integrated into any domain.

## Installation

Netget is available as an npm package:

```bash
npm i netget
```

https://netget.me

## Features
- **Versatile Handshaker**: Easily embeddable script that can be added to various websites to establish WebSocket connections.
- **Domain Pointing**: The handshaker relies on communication to a specified domain, allowing for dynamic endpoint determination.
- **Conditional Filtering**: Utilizes advanced filtering to perform checks like authentication before proceeding, ensuring secure and condition-based communications.
- **Real-Time Communication**: Leverages WebSocket technology for bi-directional, real-time interaction between clients and servers.

## Usage

### Embedding the Handshaker

The handshaker script can be embedded into any HTML or React application. It automatically establishes a WebSocket connection to the specified server endpoint upon loading.

```
htmlCopy code
<script src="path-to-netget-handshaker.js"></script>
```

### Specifying Server Endpoint

Determine the server endpoint to which the WebSocket connection should be established.

```
javascriptCopy code
const serverEndpoint = 'ws://your-websocket-server-endpoint';
const socket = new WebSocket(serverEndpoint);
```

### Handling Messages

Implement handling for incoming and outgoing messages based on user interactions or other events on the client side.

This README file provides a clear overview of the protocol, its features, how to use it, and considerations for security and scalability, while leaving room for further details and modifications according to your actual implementation and requirements.

### 1. Initialization:

When a node (be it service or registry) is created, the constructor will gather details about the node.

```js
constructor(options = {}) {
    this.nodeType = options.nodeType || 'service'; // 'service' or 'registry'
    this.metadata = options.metadata || {};
    this.network = options.network || 'development';
    this.registryNodes = new Set(options.registryNodes || []);
}
```

The node can be classified as either a 'service' node or a 'registry' node. Metadata contains information about the node, and the network determines which environment the node belongs to (e.g., 'development', 'production').

### 2. Registry Node Management:
These methods allow the system to keep track of registry nodes. If `Netget` is initialized as a service node, it will use these registry nodes to register itself.

```js
addRegistryNode(node) {
    this.registryNodes.add(node);
}

removeRegistryNode(node) {
    this.registryNodes.delete(node);
}
```

### 3. Service Registration:
When a node wants to register itself as a service node, the `registerWithNetwork` method communicates with the registry nodes to do so.

```js
registerWithNetwork() {
    // Communicate with registry nodes to register this node.
    // Send necessary details like metadata, IP address, etc.
}
```

### 4. Service Discovery:
This function allows other services or clients to discover and retrieve details of a specific service node.

```js
discoverServiceNode(serviceName) {
    // Contact registry nodes to find the service node by name.
    // Return the details of the found service node.
}
```

### 5. Decentralization:
`Netget` can manage a distributed list of nodes and sync them. Using a Distributed Hash Table (DHT) or a decentralized protocol.

### 6. Security & Validation:
Security is vital. The module will have private methods (prefixed with `_` for convention) to ensure communications are secure and validate node authenticity during registration.

```js
_validateNode() {
    // Logic to validate a node's authenticity during registration
}
```

### 7. Network Management:
The `network` property determines the environment the node belongs to. This allows for separation and management of different networks.

### 8. Node Health & Monitoring:
A private method can periodically check the health status of nodes. This ensures that all nodes in the network are active and responsive.

```js
_checkNodeHealth() {
    // Logic to periodically check the health of nodes.
    // Remove or flag nodes that are offline or unresponsive.
}
```

------

The classification of a node as either a 'service' node or a 'registry' node dictates its primary responsibilities and functionalities within the `Netget` framework. Let's break down each type of node:

### Service Node:

A **Service Node** is essentially a participant in the network that provides a specific functionality or service. This could be anything from a database service, an API endpoint, a web application, or any other service that other nodes or clients might want to interact with.

**Characteristics of a Service Node**:

1. **Service Provision**: Primarily, it provides a service to the network. This service can be queried and used by other nodes or clients.
2. **Registration**: When a Service Node starts up, it registers itself with the Registry Node(s) so that it can be discovered by other nodes or clients.
3. **Dynamic Nature**: Service Nodes can come and go. As new services are added to the network, new Service Nodes can be spun up, and as services are decommissioned, they can be shut down.

**Initiation of a Service Node**:

```js
const node = new Netget({
    nodeType: 'service',
    metadata: {
        name: 'DatabaseService',
        description: 'Provides database functionalities',
        // ... other metadata
    },
    network: 'development',
    registryNodes: ['http://registry1.netget.me', 'http://registry2.netget.me']
});

node.registerWithNetwork();
```

### Registry Node:

A **Registry Node** serves as a directory or lookup service for the network. It maintains a list of all Service Nodes, allowing clients or other nodes to discover and communicate with any Service Node they need.

**Characteristics of a Registry Node**:

1. **Discovery**: It aids in the discovery of Service Nodes. When a client wants to find a particular service, it can query a Registry Node to get the address/details of the desired Service Node.
2. **Maintains Node List**: It holds a continuously updated list of all Service Nodes in the network.
3. **Health Checks**: Optionally, a Registry Node might periodically check the health of Service Nodes to ensure they're still responsive.
4. **Static Nature (to some extent)**: Compared to Service Nodes, Registry Nodes are less dynamic. There are fewer of them, and they aren't spun up and down as frequently.

**Initiation of a Registry Node**:

```js
const registry = new Netget({
    nodeType: 'registry',
    network: 'development',
    registryNodes: [] // Note: It's a registry node itself, so it might not need to register with other registry nodes.
});

// Additional initialization specific to registry functionalities...
```

### Differences:

1. Purpose
   - **Service Node**: Provides a specific service.
   - **Registry Node**: Acts as a directory for Service Nodes.
2. Life Cycle
   - **Service Node**: More dynamic, can be spun up and down as services change.
   - **Registry Node**: More stable and persistent, there are fewer of them and they have a longer lifespan.
3. Interactions
   - **Service Node**: Registers with Registry Node(s) and waits for requests from clients.
   - **Registry Node**: Keeps track of Service Nodes and responds to discovery requests.

In the `Netget` system, these two types of nodes work in tandem. Service Nodes ensure that services are available and operational, while Registry Nodes make sure that these services can be easily found and accessed.

-----------

In essence, `Netget` acts as a facilitator for nodes in a network. If a new service is spun up and wants to be discoverable, it will use `Netget` to register with the known registry nodes. When another service or client wants to find a service, it will ask `Netget` to discover it for them. The entire module serves as a manager for network-related tasks, abstracting away the intricacies of node management, service discovery, and network health.

This modular design ensures that `Netget` remains separate from the application logic. Whether the end application uses Express, Next.js, or any other framework, `Netget` can be easily integrated to manage networking tasks, ensuring that application developers can focus on building their application without worrying about the complexities of the network layer.

Enhance netget to support the concept of registry nodes and service nodes.
Service nodes, when initialized, use netget to register with the network.
netget handles the process of finding registry nodes, validating the service node, and updating its status.
Additionally, netget can provide methods for service discovery, where clients can find the address and service details of a particular node.

# netget Architecture & Features.



### Service Node Initialization:

netget will provide a simple API that allows any node to initialize itself as a service node.
During initialization, the service node will specify its metadata, including service details, preferred network (e.g., development, production, custom), and other information.
Registry Node Management:

netget must have a way to identify and communicate with registry nodes.
It could come pre-configured with a list of trusted registry nodes, or nodes might specify them during initialization.
Service Registration:

When a service node is initialized, netget will handle the registration process with the registry nodes.
This includes sharing the node's metadata, IP address, and validating its authenticity.
Service Discovery:

**netget** will provide APIs that allow any client or service to query for a specific service node.
It will connect to registry nodes, find the requested service details, and return them to the client.
Decentralization Support:

If decentralization is a goal, netget needs mechanisms to manage a distributed list of nodes and synchronize this data.
For example, using a DHT approach as mentioned previously.
Security & Validation:

**netget** should ensure all communications are secure, possibly using cryptographic techniques.
It should provide methods for validating the authenticity of nodes during the registration process.
Network Management:

Nodes should be able to specify which network they want to be part of (e.g., development, production).
netget will manage these networks separately, ensuring isolation between them.
Node Health & Monitoring:

**netget** could have built-in features to periodically check the health of registered nodes.
If a node is found to be offline or unresponsive, it could be temporarily removed from the active nodes list.

## Security Considerations

- **CORS**: Configure Cross-Origin Resource Sharing on your WebSocket server to accept connections from different origins.
- **WSS**: Use Secure WebSocket for encrypted connections when dealing with sensitive information.

## Scalability Considerations

Architect your WebSocket server to handle multiple concurrent connections based on your expected load.

## Contributing

Contributions to the Netget Protocol are welcome. Please read [CONTRIBUTING.md](https://chat.openai.com/c/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Acknowledgements

Special thanks to all contributors and users of the Netget Protocol for making real-time, secure, and scalable communications possible.

## License & Policies
- **License**: MIT License (see LICENSE for details).
- **Privacy Policy**: Respects user privacy; no collection/storage of personal data.
- **Terms of Usage**: Use responsibly. No guarantees/warranties provided. [Terms](https://www.neurons.me/terms-of-use) | [Privacy](https://www.neurons.me/privacy-policy)

<img src="./_._.svg" alt="SVG Image" width="69" height="69" style="width69px; height:69px;">
