const net = require('net');

const LOCAL_PORT = 8080;    // Puerto en el que escucha tu aplicación
const REMOTE_PORT = 9090;   // Puerto del servidor remoto al que deseas reenviar el tráfico
const REMOTE_ADDR = '192.168.1.100';  // Dirección IP del servidor remoto

const server = net.createServer((localSocket) => {
    const remoteSocket = new net.Socket();

    remoteSocket.connect(REMOTE_PORT, REMOTE_ADDR, () => {
        localSocket.pipe(remoteSocket);
        remoteSocket.pipe(localSocket);
    });

    remoteSocket.on('error', (err) => {
        console.error("Error en el socket remoto:", err);
        localSocket.end();
    });

    localSocket.on('error', (err) => {
        console.error("Error en el socket local:", err);
        remoteSocket.end();
    });
});

server.listen(LOCAL_PORT, () => {
    console.log('TCP server listening on port', LOCAL_PORT);
});

server.on('error', (err) => {
    console.error("Error en el servidor:", err);
});
