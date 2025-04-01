"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var ws = new ws_1.WebSocket('ws://localhost:3000');
// Send a message from the client
process.stdin.on('data', function (input) {
    var message = input.toString().trim();
    if (message) {
        ws.send(message);
    }
});
// Listen for messages from the server
ws.on('message', function (data) {
    console.log('Received from server:', data.toString());
});
// Handle connection errors
ws.on('error', function (error) {
    console.error('Connection error:', error.message);
});
