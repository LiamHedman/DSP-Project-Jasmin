
const express = require('express');
import { Request, Response } from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = 3000;

// Handle requests to "/"
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World! The server is working.');
    //res.send({test: "first test"});
  });

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('A new client connected.');

  ws.on('message', (message: string) => {
    //console.log('Received from client:', message.toString());

    try {
      console.log("progress");
      const parsed_message = JSON.parse(message);
      if(parsed_message) {
        console.log("inside if parserd msg");
        switch (parsed_message.type) {
          case "login":
            console.log("SUCCESSFULL PARSE OF LOGIN");
            console.log(`Username: ${parsed_message.data.username}`);
            console.log(`Password: ${parsed_message.data.password}`);
        }
      } else {
        console.log("PARSED MESSAGE TYPE NOT SPECIFIED");
      }

    } catch {
      console.log("ERROR UPON RECEIVING DATA FROM USER");      
    }


    // Broadcast the message to all connected clients
/*     wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        //client.send(message.toString());
        client.send(JSON.stringify({"name": "Alice", "age": 25}));
      }
    }); */
  });

  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});
