"use strict";
/* import axios, { AxiosResponse } from 'axios';

async function sendMessage(message: string): Promise<void> {
  try {
    const response: AxiosResponse<{ status: string; message: string }> = await axios.post(
      'http://localhost:3000/send',
      { message }
    );
    console.log('Server response:', response.data);
  } catch (error: any) {
    console.error('Error sending message:', error.message);
  }
}

process.stdin.on('data', (input: Buffer) => {
  const message: string = input.toString().trim();
  if (message) {
    sendMessage(message);
  }
});

async function pollMessages(): Promise<void> {
  try {
    const response: AxiosResponse<string[]> = await axios.get('http://localhost:3000/messages');
    console.log('Received from server:', response.data);
  } catch (error: any) {
    console.error('Polling error:', error.message);
  }
}

setInterval(pollMessages, 2000); */ 
