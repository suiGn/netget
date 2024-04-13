<img src="https://suign.github.io/assets/imgs/netget.png" alt="netget.me" width="244" height="203">

# NetGet

-----------
### [Project Status : Experimental and Under Development, Subject to Major Changes]
The module is in active development, and as such, it is subject to significant changes as we refine our approach and methodologies to best support our goals.
visit: https://neurons.me to learn more.
----------

# Unleash the Cyberspace Within
**NetGet** streamlines the orchestration of digital domains with the simplicity of a pedal's press, enabling seamless symphonies across networked realms. Acts as a dynamic conduit, **directing internet traffic to local services**. Inspired by the vast digital landscapes of cyberpunk lore.

Visit [netget.me](https://netget.me)

## Installation
Install NetGet via npm:
```bash
npm install netget
```

## Usage
Import NetGet in your Node.js application:
```js
import { Gateway } from 'netget';
// Initialize and configure your Gateway
const gateway = new Gateway();
gateway.listen();
```
Now you can:
```bash
npm start
```

Your main application and the gateway will be hosted at localhost.

## Configuration
NetGet relies on a `domains.json` file for routing configuration, structured as follows:

```json
{
  "name": "YourDomainConfigName",
  "domains": {
    "example.com": "exampleHandler",
    "anotherdomain.com": "anotherHandler"
  }
}
```

Each domain key maps to a handler module that exports a function to handle requests for that domain.
By default, NetGet searches for a `domains.json` configuration in the `./config` directory, streamlining the setup process.

**NetGet** is particularly useful in environments where multiple services or applications must be accessible through a single entry point, commonly known as a **reverse proxy setup.**

Scenario: Local and Remote NetGet Interaction
Local NetGet Setup: On your local machine, NetGet operates within your Node.js environment, managing local traffic and processing requests according to your configured rules. It doesn't directly face the internet and instead communicates with an external NetGet instance that does.

Remote NetGet as a Reverse Proxy: The main.netget.me hosted on Nginx acts as your gateway to the internet. It receives internet traffic and forwards it to the appropriate local NetGet instance based on the domain routing configured.

Handshaker Mechanism: For machines not directly accessible via a public IP, the remote NetGet instance (main.netget.me) can act as a handshaker. Your local NetGet instance communicates with this handshaker, which then relays traffic between the internet and your local network.


### Scalable Web Services
In a microservices architecture, **NetGet can route requests to different services** within your infrastructure, making it an ideal solution for developers looking to scale their applications horizontally. Each service can have its own domain, and **NetGet** will ensure that requests are forwarded to the correct service.

### Personal Hosting Solutions
For personal web hosting, **NetGet** provides an **easy-to-set-up gateway** for routing traffic to various self-hosted applications. Users with several web applications running on a home server can use **NetGet** to manage access to these applications through different domains.

### Secure Access Control
Combined with authentication layers, NetGet can control access to various parts of a web infrastructure, ensuring that only authorized users can access specific services.

### Simplified Configuration
With NetGet, the complexity of setting up a domain routing system is abstracted away. Users can define their routing logic in a simple JSON configuration file, making the management of domain routes straightforward and maintainable.

### Dynamic Load Balancing
NetGet can be extended to include load balancing capabilities, distributing incoming requests across multiple instances of a service to balance the load and improve performance.

By using **NetGet,** developers and system administrators can create a more organized and efficient network topology, where the flow of requests is handled systematically, aligning with the concept of futuristic control and management of digital spaces.

----------

# About All.This

## Modular Data Structures:

**[this.me](https://suign.github.io/this.me)  - [this.audio](https://suign.github.io/this.audio) - [this.text](https://suign.github.io/this.text) - [this.wallet](https://suign.github.io/this.wallet) - [this.img](https://suign.github.io/this.img) - [this.pixel](https://suign.github.io/Pixels) - [be.this](https://suign.github.io/be.this) - [this.DOM](https://suign.github.io/this.DOM) - [this.env](https://suign.github.io/this.env/) - [this.GUI](https://suign.github.io/this.GUI) - [this.be](https://suign.github.io/this.be) - [this.video](https://suign.github.io/this.video) - [this.atom](https://suign.github.io/this.atom) - [this.dictionaries](https://suign.github.io/this.dictionaries/)**

**Each module** in **[all.this](https://neurons.me/all-this)** represents a specific **datastructure**. These classes encapsulate the functionalities and **data specific to their domain.**

## **Utils**

**[all.this](https://neurons.me/all-this)** not only aggregates these modules but also provides utilities to facilitate the integration, management, and enhancement of these data structures. **For example:**

*The integration with [cleaker](https://suign.github.io/cleaker/) ensures each module instance has a **unique cryptographic identity**, enhancing security and data integrity.*

### Neurons.me Ecosystem Glossary:

visit: [Neurons.me Glossary](https://suign.github.io/neurons.me/Glossary) 

## License & Policies

- **License**: MIT License (see LICENSE for details).

- **Privacy Policy**: Respects user privacy; no collection/storage of personal data.

- **Terms of Usage**: Use responsibly. No guarantees/warranties provided. [Terms](https://www.neurons.me/terms-of-use) | [Privacy](https://www.neurons.me/privacy-policy)

  **Learn more** at https://neurons.me

  **Author:** SuiGn

  [By neurons.me](https://neurons.me)

  <img src="https://suign.github.io/neurons.me/neurons_logo.png" alt="neurons.me logo" width="123" height="123" style="width123px; height:123px;">
