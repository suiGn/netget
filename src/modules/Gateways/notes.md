Connection Management:
pm2.connect is used to establish a connection to the PM2 daemon.
Each operation (start, stop, restart, delete) ensures to disconnect from PM2 using pm2.disconnect after completing the operation to avoid leaving open connections.

