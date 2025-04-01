"use strict";
// Enable strict typing on row 88 in the tsconfig file!
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const ws_1 = require("ws");
const app = express();
const PORT = 3000;
// Handle requests to "/"
app.get('/', (req, res) => {
    res.send('Hello, World! The server is working.');
});
// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Set up WebSocket server
const wss = new ws_1.WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('A new client connected.');
    ws.on('message', (message) => {
        console.log('Received from client:', message.toString());
        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(message.toString());
            }
        });
    });
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});
