
const express = require('express');
import { Request, Response } from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = 3000;

let active_clients: number = 0;

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
  console.log(`Number of active clients: ${++active_clients}`);


  ws.on('message', (message: string) => {

    try {
      const parsed_message = JSON.parse(message);
      if(parsed_message) {
        switch (parsed_message.type) {
          case "new_ad":
            console.log(`title: ${parsed_message.data.title}`);
            console.log(`bio: ${parsed_message.data.bio}`);

            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(message);
              }
            });
            
        }
      } else {
        console.log("PARSED MESSAGE TYPE NOT SPECIFIED");
      }

    } catch {
      console.log("ERROR UPON RECEIVING DATA FROM USER");      
    }

  });

  ws.on('close', () => {
    console.log('A client disconnected.');
    console.log(`Number of active clients: ${--active_clients}`);
  });
});