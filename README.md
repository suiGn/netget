<img src="https://suign.github.io/assets/imgs/netget.png" alt="netget.me" width="244" height="203">

# NetGet

-----------
# Unleash the Cyberspace Within

> In development stage and subject to changes.
>
> Learn more at: [netget.me](https://netget.me)

**NetGet** streamlines the orchestration of domains and networks with the simplicity of a pedal's press, enabling seamless connections across networked realms. Acts as a dynamic conduit, **directing internet traffic to local services**. Inspired by the vast digital landscapes of cyberpunk lore and the simplicity of guitar pedals.



## Installation

**NetGet** is available as an npm package and can be installed globally using npm. This allows you to use **NetGet** from anywhere on your system.

```bash
npm install -g netget
```

## Starting the CLI

Once installed, you can start the NetGetX CLI by simply running the following command in your terminal:

```bash
netget
```

## What Does NetGetX Do?

**NetGetX** serves as a front face to the public. Acting as a reverse proxy to redirect all traffic in a specify Port. 

By using NetGetX, you ensure that NGINX is optimally configured to act as a robust, efficient channel, directing incoming traffic to the right internal endpoints without manual intervention.

---

# NetGet GateWays

**NetGet** is particularly useful in environments where multiple services or applications must be accessible through a single entry point, commonly known as a **reverse proxy setup.**

**Local NetGet Setup:** On your local machine, **NetGet** operates within your Node.js environment, managing local traffic and processing requests according to your configured rules. The GateWays doesn't directly face the internet and instead communicates with an external **NetGetX** instance that does.

## Install as a Node Module Dependency.

```bash
npm install netget
```

### GateWay SetUp

```js
// NETGET
import NetGet from 'netget';
import { routes } from './GET/routes.js';
let netget = new NetGet();
netget.Gateway({ routes: routes }).listen();
```

If no port specified the Gateway listens at http://localhost:3004/

This will set up a gateway that will listen to all traffic in a specific port, detect the domain, host, subdomain and act accordingly.

### Constructor:

* Initializes a new instance of the Gateway class.
* @param {Object} config - The configuration object for the gateway.
* @param {Object} [config.host='localhost']  - The host name on which the gateway will listen.
* @param {number} [config.port=3432] - The port number on which the gateway will listen.
* @param {Object} [config.routes={}] - An object mapping domains to their respective request handlers.
* @param {string} [config.domainsConfigPath='./config/domains.json'] - The path to the domains configuration file.

```js
class Gateway {
  constructor({   
   host = process.env.HOST || 'localhost', 
   port = process.env.NETGET_PORT || 3432, 
   routes = {},
   domainsConfigPath = process.env.DOMAINS_CONFIG_PATH || './config/domains.json' 
  } = {}) {
   this.host = host;
   this.port = port;
   this.routes = routes;
   this.domainsConfigPath = domainsConfigPath;
   this.app = express();
   this.initialize().catch(err => console.error('Initialization error:', err));
  }
```



It detect the host making the request, domain, subdomain and acts accordingly through the routes given and its handlers.




### Scalable Web Services
In a microservices architecture, **NetGet can route requests to different services** within your infrastructure, making it an ideal solution for developers looking to scale their applications horizontally. Each service can have its own domain, and **NetGet** will ensure that requests are forwarded to the correct service.

### Personal Hosting Solutions
For personal web hosting, **NetGet** provides an **easy-to-set-up gateway** for routing traffic to various self-hosted applications. Users with several web applications running on a home server can use **NetGet** to manage access to these applications through different domains.

### Secure Access Control
Combined with authentication layers, NetGet can control access to various parts of a web infrastructure, ensuring that only authorized users can access specific services.

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
