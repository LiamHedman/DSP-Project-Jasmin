/* import express, { Request, Response } from 'express';

const app = express();
const PORT: number = 3000;

app.use(express.json());
let messages: string[] = [];

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World! The server is working.');
  //res.send({test: "first test"});
});

app.post('/send', (req: Request, res: Response) => {
  const { message } = req.body as { message?: unknown };
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }
  console.log('Received from client:', message);
  messages.push(message);
  res.json({ status: 'Message received', message });
});



app.get('/messages', (req: Request, res: Response) => {
  res.json(messages);
});

// Start the server only if this is the main module
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} */