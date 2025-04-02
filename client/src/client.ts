import { WebSocket } from 'ws';

const ws = new WebSocket('ws://localhost:3000');

// Send a message from the client
process.stdin.on('data', (input) => {
  const message = input.toString().trim();
  if (message) {
    ws.send(message);

    const login = {
      "type": "login",
      "data": {
        "username": "Anders",
        "password": "superanders"
      }
    };
    
    ws.send(JSON.stringify(login));
  }
});

// Listen for messages from the server
ws.on('message', (data) => {
  console.log('Received from server:', data.toString());
});

// Handle connection errors
ws.on('error', (error) => {
  console.error('Connection error:', error.message);
});
