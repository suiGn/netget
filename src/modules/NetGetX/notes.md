Explanation of the Scenario
Let's break down the scenario step by step to understand what happens:

1. Main Server Setup
Main Server Domain: netget.site
SSL Certificate for: netget.site
Server Block Configuration:
Listen Ports: 80 (HTTP) and 443 (HTTPS)
Server Name: netget.site
Proxy Pass: The main server is acting as a reverse proxy, directing traffic to the appropriate backend services based on the XBlocks configuration.
XBlocks: These are separate server configurations included in the main server configuration. Each XBlock can have its own domain and SSL certificate.
2. DNS Records Setup
A Record: netget.site -> Public IP (e.g., 104.198.147.130)
CNAME Record: *.cleaker.me -> netget.site
3. SSL Certificates
Main Server: Has an SSL certificate for netget.site.
XBlocks (e.g., cleaker.me): Each XBlock can have its own SSL certificate, e.g., cleaker.me has an SSL certificate for cleaker.me.
What Happens in the Scenario?
DNS Resolution:

When a user tries to access subdomain.cleaker.me, DNS resolves subdomain.cleaker.me to netget.site due to the CNAME record.
The browser will then send an HTTP/HTTPS request to netget.site.
SSL/TLS Handshake:

The SSL/TLS handshake begins with the browser requesting the SSL certificate for subdomain.cleaker.me.
The server at netget.site needs to provide the correct SSL certificate for subdomain.cleaker.me.
Server Configuration:

The main server, configured with server_name netget.site, receives the request.
If the main server block is configured as a catch-all (server_name _;), it can handle requests for any domain not explicitly defined.
The server checks its configuration to determine the appropriate server block or XBlock to handle the request.
XBlock Matching:

If the request is for subdomain.cleaker.me, the main server should check the XBlocks configuration.
If cleaker.me is configured as an XBlock with its SSL certificate and configuration, the server can match the request to the cleaker.me XBlock.
Proxy and SSL Certificate Handling:

If the XBlock for cleaker.me is correctly configured and included in the main server configuration, the server will use the SSL certificate for cleaker.me to complete the SSL/TLS handshake.
Once the handshake is successful, the server will proxy the request to the appropriate backend as configured in the cleaker.me XBlock.
Cross-Origin and Certificate Validity
Cross-Origin Resource Sharing (CORS):

If cleaker.me is served through an XBlock under netget.site, the server needs to handle CORS headers appropriately.
If the main server or XBlocks are not correctly configured to handle CORS, it can lead to issues with cross-origin requests.
SSL Certificate Validity:

If the server is configured correctly with individual SSL certificates for each XBlock (e.g., cleaker.me), the SSL certificate for cleaker.me will be used when handling requests for cleaker.me.
This ensures that the SSL certificate presented to the browser matches the requested domain, maintaining a secure connection.
Potential Issues
Misconfiguration:
If the XBlock for cleaker.me is not correctly configured or included in the main server configuration, the request may not be handled correctly, leading to SSL certificate errors or proxy errors.
CORS Mismanagement:
Improper handling of CORS headers can lead to issues with cross-origin requests, causing browsers to block requests that do not meet CORS policy.
Conclusion
With the described setup, if everything is configured correctly, including SSL certificates for each XBlock and proper inclusion in the main server configuration, the requests should be handled appropriately. The server will match requests based on the XBlocks configuration, and the correct SSL certificate will be used to establish a secure connection. Proper CORS configuration is also crucial to ensure smooth handling of cross-origin requests.