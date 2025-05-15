"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var ws_1 = require("ws");
var app = express();
var PORT = 3000;
var active_clients = 0;
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
    console.log("Number of active clients: ".concat(++active_clients));
    ws.on('message', function (message) {
        try {
            var parsed_message = JSON.parse(message);
            console.log(parsed_message);
            if (parsed_message) {
                switch (parsed_message.type) {
                    case "new_ad":
                        console.log("title: ".concat(parsed_message.data.title));
                        console.log("bio: ".concat(parsed_message.data.bio));
                        wss.clients.forEach(function (client) {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(message);
                            }
                        });
                    case "message":
                        var id = Number(parsed_message.message.id);
                        var text = parsed_message.message.text;
                        var sender = parsed_message.message.sender;
                        id++;
                        console.log(id);
                        console.log(text);
                        console.log(sender);
                        var new_message = { type: "message", message: { id: id, text: text, sender: 'bot' } };
                        ws.send(JSON.stringify(new_message));
                }
            }
            else {
                console.log("PARSED MESSAGE TYPE NOT SPECIFIED");
            }
        }
        catch (_a) {
            console.log("ERROR UPON RECEIVING DATA FROM USER");
        }
    });
    ws.on('close', function () {
        console.log('A client disconnected.');
        console.log("Number of active clients: ".concat(--active_clients));
    });
});
