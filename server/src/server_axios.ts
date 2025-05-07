import express, { Request, Response } from "express";
import cors from "cors";
import insert_data from "./database/data_insertion";
import retrieve_data from "./database/data_retrieval";
import delete_data from "./database/data_deletion";
import modify_data from "./database/data_modification";
import { Supply_post, User } from "./../../common/src/classes"
import { table_name_supply_posts, table_name_users } from "./database/connection_pooling";

const app = express();
const PORT = 3000;

// Middleware which enables automatic JSON parsing
app.use(express.json());
// Enables cross-origin resource sharing
// i.e. enables the front end (different port) to communicate
// to the server
app.use(cors());// TODO: this is not safe in production




async function user_exists(username: string): Promise<boolean> {
    const conditions = {
        name: username
    };
    const result = await retrieve_data(table_name_users, conditions);
    return result.length;
}

async function check_password(password: string, username: string): Promise<boolean> {
    const conditions = {
        name: username,
        password: password
    };
    const result = await retrieve_data(table_name_users, conditions);
    return result.length;
}

// Handles register user request from the client
// Listens to all axios.post(`${SERVER_URL}/register_user` from the client
app.post("/register_user", async (req: Request, res: Response) => {
    const user: User = req.body;
    
    try {
        console.log(`user temp test 1: ${user.name}`);
        if (await user_exists(user.name)) { 
            console.log(`checks if user exists: ${user.name}`);
            throw new Error("User with this username already exists"); }

        console.log(`User "${user.name}" registered`);
        await insert_data(table_name_users, user);
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
});

// Handles login requests from the client
// Listens to all axios.post(`${SERVER_URL}/login` from the client
app.post("/login", async (req: Request, res: Response) => {
	const user = req.body;
    
	try {
        if (!await user_exists(user.name)) { throw new Error("User with this username doesnt exist"); }
        if (!await check_password(user.password, user.name)) { throw new Error("The password is incorrect for this username"); }

        console.log(`User "${user.name}" successfully logged in`);
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
});

// Listens for a new post from a client. 
app.post("/new_supply_post", async (req: Request, res: Response) => {
    const { id, owner_id, title, description, price, category, location, post_picture_url, created_at } = req.body;

    try {
        const post_data = new Supply_post(id, owner_id, title, description, price, category, location, post_picture_url, created_at);
        console.log(`ID of new supply post: ${id}`);
        console.log(`Title of new supply post: ${title}`);

        await insert_data(table_name_supply_posts, post_data);
        res.status(200).json();
    } catch (error: any) {
        console.error("Failed to create new supply post:", error.message);
        res.status(500).json();
    }
});

app.post("/edit_supply_post", async (req: Request, res: Response) => {
    const { id, owner_id, title, description, price, category, location, post_picture_url, created_at } = req.body;
    const criteria = { id: id };
    
    try {
        const post_data = new Supply_post(id, owner_id, title, description, price, category, location, post_picture_url, created_at);
        console.log(`ID of the edited suuply post: ${id}`);
        console.log(`Title of edited supply post: ${title}`);

        await modify_data(table_name_supply_posts, post_data, criteria);
        res.status(200).json();
    } catch (error: any) {
        console.error("Failed to edit supply post:", error.message);
        res.status(500).json();
    }
});

app.post("/delete_supply_post", async (req: Request, res: Response) => {
	// TODO: post_title should be post_id
	const { title } = req.body;

	try {
		// TODO: post_title should be post_id
		await delete_data(table_name_supply_posts, { title: title });
		res.status(200).json();
	} catch (error: any) {
		console.error("Failed to delete supply post", error.message);
		res.status(500).json();
	}
});

app.post("/reset_table", async (req: Request, res: Response) => {
    try {
        await delete_data(table_name_supply_posts, {});
        res.status(200).json();
    } catch (error: any) {
		console.error("Failed to reset table", error.message);
        res.status(500).json();
    }
});

// Is a GET request handler, i.e. used by the client to retrieve data from the server
// Handles all await axios.get(`${SERVER_URL}/retrieve_posts`);
app.get("/fetch_all_supply_posts", async (req: Request, res: Response) => {
	try {
		// Retrieves all the active supply posts
		// {} is used as a criteria to fetch all entries
        const all_supply_posts = await retrieve_data(table_name_supply_posts, {});
        res.status(200).json(all_supply_posts);
    } catch (error: any) {
        console.error("Error fetching supply posts", error.message);
        res.status(500).json();
    }
});



// Listens on the port 3000
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});