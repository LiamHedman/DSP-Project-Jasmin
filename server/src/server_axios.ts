import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let ads: { title: string; bio: string }[] = [];

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World! The server is working.');
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  console.log(`User logged in: ${username}`);

  res.status(200).json({ status: 'Login successful' });
});

app.post('/new_ad', (req: Request, res: Response) => {
  const { title, bio } = req.body;

  if (!title || !bio) {
    return res.status(400).json({ error: 'Missing title or bio' });
  }

  console.log(`title: ${title}`);
  console.log(`bio: ${bio}`);

  ads.push({ title, bio });

  res.status(200).json({ status: 'Ad received successfully' });
});

app.get('/ads', (req: Request, res: Response) => {
  res.json(ads);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});