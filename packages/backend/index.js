"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({ strapi }) {
        // Helper function to check if a port is in use
        strapi.isPortInUse = async (port) => {
            return new Promise((resolve) => {
                const net = require('net');
                const tester = net.createServer()
                    .once('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                })
                    .once('listening', () => {
                    tester.once('close', () => resolve(false)).close();
                })
                    .listen(port);
            });
        };
        // Helper to find an available port
        strapi.findAvailablePort = async (preferredPort, alternativePorts) => {
            try {
                // Check if preferred port is available
                const isPreferredPortInUse = await strapi.isPortInUse(preferredPort);
                if (!isPreferredPortInUse) {
                    return preferredPort;
                }
                // Try alternative ports if provided
                if (alternativePorts && alternativePorts.length > 0) {
                    for (const port of alternativePorts) {
                        // Skip preferred port if it's in the alternatives list
                        if (port === preferredPort)
                            continue;
                        const isPortInUse = await strapi.isPortInUse(port);
                        if (!isPortInUse) {
                            return port;
                        }
                    }
                }
                // If we get here, try to find a random available port
                return new Promise((resolve, reject) => {
                    const net = require('net');
                    const server = net.createServer();
                    server.unref();
                    server.on('error', reject);
                    server.listen(0, () => {
                        const port = server.address().port;
                        server.close(() => resolve(port));
                    });
                });
            }
            catch (err) {
                strapi.log.error(`Error finding available port: ${err.message}`);
                // If we get here, no ports are available from our list
                return -1;
            }
        };
    },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    bootstrap({ strapi }) {
        try {
            // Check if the HTTP server is already running
            if (!strapi.server.httpServer) {
                strapi.log.error('HTTP server not initialized.');
                // Check if it's a port conflict issue
                const configuredPort = process.env.PORT || strapi.config.get('server.port', 4000);
                strapi.isPortInUse(Number(configuredPort)).then(async (inUse) => {
                    if (inUse) {
                        // Try to find an alternative port if the configured one is in use
                        strapi.log.error(`⛔️ Port ${configuredPort} is already in use.`);
                        // Get alternative ports from environment or use defaults
                        const altPortsStr = process.env.ALTERNATIVE_PORTS || '4001,5000,8000,8080';
                        const alternativePorts = altPortsStr.split(',').map(p => parseInt(p, 10)).filter(p => !isNaN(p));
                        strapi.log.info(`Checking alternative ports: ${alternativePorts.join(', ')}`);
                        try {
                            const availablePort = await strapi.findAvailablePort(Number(configuredPort), alternativePorts);
                            if (availablePort > 0) {
                                strapi.log.info(`💡 Try using port ${availablePort} instead with: PORT=${availablePort} npm run develop`);
                                strapi.log.info(`💡 Or use the start-server script: node scripts/start-server.js`);
                            }
                            else {
                                // Try to find any random available port as last resort
                                const server = require('net').createServer();
                                await new Promise(resolve => {
                                    server.listen(0, () => {
                                        const randomPort = server.address().port;
                                        server.close(() => {
                                            strapi.log.info(`💡 All configured ports are in use. Try random port ${randomPort} with: PORT=${randomPort} npm run develop`);
                                            resolve();
                                        });
                                    });
                                });
                            }
                        }
                        catch (err) {
                            strapi.log.error(`Failed to find available port: ${err.message}`);
                            strapi.log.info('Please manually specify an available port with: PORT=<port> npm run develop');
                        }
                    }
                });
                return;
            }
            // Log server port information
            const port = process.env.PORT || strapi.config.get('server.port', 4000);
            const host = strapi.config.get('server.host', '0.0.0.0');
            // Check if the server is actually bound to the port
            try {
                const addr = strapi.server.httpServer.address();
                const boundPort = addr && typeof addr === 'object' ? addr.port : port;
                // Log with more visually distinct formatting
                strapi.log.info(`┌────────────────────────────────────────────────────────┐`);
                strapi.log.info(`│ 🚀 Server running on: http://${host === '0.0.0.0' ? 'localhost' : host}:${boundPort}${' '.repeat(Math.max(0, 39 - boundPort.toString().length - (host === '0.0.0.0' ? 'localhost' : host).length))}│`);
                strapi.log.info(`└────────────────────────────────────────────────────────┘`);
                // Store actual port for reference
                strapi.config.set('server.actualPort', boundPort);
            }
            catch (err) {
                strapi.log.warn(`Unable to determine actual bound port: ${err.message}`);
                strapi.log.info(`Server configured for port: ${port}`);
            }
        }
        catch (error) {
            strapi.log.error(`Failed to initialize services: ${error.message}`);
        }
    },
};
