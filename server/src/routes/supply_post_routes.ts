import { Supply_post } from "../../../common/src/classes";
import { table_name_supply_posts } from "../database/connection_pooling";
import delete_data from "../database/data_deletion";
import insert_data from "../database/data_insertion";
import modify_data from "../database/data_modification";
import retrieve_data from "../database/data_retrieval";
import express, { Request, Response } from "express";

const router = express.Router();

// Listens for a new post from a client. 
router.post("/new_supply_post", async (req: Request, res: Response) => {
    const { owner_id, owner_name, title, description, price, category, category_type, location, post_picture_url, created_at } = req.body;

    try {
        const post_data = new Supply_post(owner_id, owner_name, title, description, price, category, category_type, location, post_picture_url, created_at);

        await insert_data(table_name_supply_posts, post_data);
        res.status(200).json();
    } catch (error: any) {
        console.error("Failed to create new supply post:", error.message);
        res.status(500).json();
    }
});

router.post("/edit_supply_post", async (req: Request, res: Response) => {
    const { id, owner_id, owner_name, title, description, price, category, category_type, location, post_picture_url, created_at } = req.body;
    const { id, owner_id, owner_name, title, description, price, category, category_type, location, post_picture_url, created_at } = req.body;
    const criteria = { id: id };
    
    try {
        const post_data = new Supply_post(owner_id, owner_name, title, description, price, category, category_type, location, post_picture_url, created_at);
        const post_data = new Supply_post(owner_id, owner_name, title, description, price, category, category_type, location, post_picture_url, created_at);
        console.log(`ID of the edited suuply post: ${id}`);
        console.log(`Title of edited supply post: ${title}`);

        await modify_data(table_name_supply_posts, post_data, criteria);
        res.status(200).json();
    } catch (error: any) {
        console.error("Failed to edit supply post:", error.message);
        res.status(500).json();
    }
});

router.post("/delete_supply_post", async (req: Request, res: Response) => {
	const { id } = req.body;

	try {
        
		await delete_data(table_name_supply_posts, { id: id });
		res.status(200).json();
	} catch (error: any) {
		console.error("Failed to delete supply post", error.message);
		res.status(500).json();
	}
});



// Is a GET request handler, i.e. used by the client to retrieve data from the server
// Handles all await axios.get(`${SERVER_URL}/retrieve_posts`);
router.get("/fetch_all_supply_posts", async (req: Request, res: Response) => {
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

router.get("/fetch_my_supply_posts", async (req: Request, res: Response) => {
    const user_id = req.headers.auth;

    try {
        const condition = { owner_id: user_id };
        const supply_posts: Supply_post[] = await retrieve_data(table_name_supply_posts, condition);
        
        res.status(200).json(supply_posts);
    } catch (error) {
        res.status(500).json();
    }
});

router.get("/fetch_supply_post", async (req: Request, res: Response) => {
    const post_id = req.headers.auth;

    try {
        const condition = { id: post_id };
        const supply_posts: Supply_post[] = await retrieve_data(table_name_supply_posts, condition);

        
        res.status(200).json(supply_posts[0]);
    } catch (error) {
        res.status(500).json();
    }
});


export { router as supply_post_routes };