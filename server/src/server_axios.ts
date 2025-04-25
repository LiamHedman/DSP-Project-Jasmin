import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware which enables automatic JSON parsing
app.use(express.json());
// Enables cross-origin resource sharing
// i.e. enables the front end (different port) to communicate
// to the server
app.use(cors());	// TODO: this is not safe in production

type Post = {
    type: string,
    data: {
        title: string,
        bio: string
    }
};

// Array of ads
let posts_array: Post[] = [];	// TODO: should be the database

// Handles login requests from the client
// Listens to all axios.post(`${SERVER_URL}/login` from the client
app.post("/login", (req: Request, res: Response) => {
	const { username } = req.body;

	console.log(`User "${username}" connected`);

	// status(200) is the success message thats get sent back
	// to the client, i.e. communicates that the connections was successful
	res.status(200).json({ status: "Connection successful" });
});


// Listens for a new post from a client. 
app.post("/new_post", (req: Request, res: Response) => {
	const { type, data } = req.body;

	if (type !== "new_post" || !data?.title || !data?.bio) {
		return res.status(400).json({ error: "Invalid request format or missing title/bio" });
	}
	
	console.log(`title: ${data.title}`);
	console.log(`bio: ${data.bio}`);

	const post_data = {
		"type": type,
		"data": {
			"title": data.title,
			"bio": data.bio
		}
	};
	
	posts_array.push(post_data);

	res.status(200).json({ status: "Post received successfully" });
});

// Is a GET request handles, i.e. used by the client to retrieve data from the server
// Handles all await axios.get(`${SERVER_URL}/retrieve_posts`);
app.get("/fetch_posts", (req: Request, res: Response) => {
	// Returns the posts_array
	res.json(posts_array);
});

// Listens on the port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});