"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var ws_1 = require("ws");
var app = express();
var PORT = 3000;
// Handle requests to "/"
app.get('/', function (req, res) {
    res.send('Hello, World! The server is working.');
    //res.send({test: "first test"});
});
// Start the server
var server = app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
// Set up WebSocket server
var wss = new ws_1.WebSocketServer({ server: server });
wss.on('connection', function (ws) {
    console.log('A new client connected.');
    ws.on('message', function (message) {
        console.log('Received from client:', message.toString());
        // Broadcast the message to all connected clients
        wss.clients.forEach(function (client) {
            if (client !== ws && client.readyState === 1) {
                //client.send(message.toString());
                client.send(JSON.stringify({ "name": "Alice", "age": 25 }));
            }
        });
    });
    ws.on('close', function () {
        console.log('A client disconnected.');
    });
});
