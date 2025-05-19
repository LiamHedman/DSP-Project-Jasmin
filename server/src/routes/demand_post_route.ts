import { Demand_post } from "../../../common/src/classes";
import { table_name_demand_posts } from "../database/connection_pooling";
import delete_data from "../database/data_deletion";
import insert_data from "../database/data_insertion";
import modify_data from "../database/data_modification";
import retrieve_data from "../database/data_retrieval";
import express, { Request, Response } from "express";

const router = express.Router();

// Listens for a new post from a client. 
router.post("/new_demand_post", async (req: Request, res: Response) => {
    const { id, owner_id, owner_name, title, description, price, category, location, created_at } = req.body;

    try {
        const post_data = new Demand_post(id, owner_id, owner_name, title, description, price, category, location, created_at);
        console.log(`ID of new demand post: ${id}`);
        console.log(`Title of new demand post: ${title}`);

        await insert_data(table_name_demand_posts, post_data);
        res.status(200).json();
    } catch (error: any) {
        console.error("Failed to create new demand post:", error.message);
        res.status(500).json();
    }
});

router.post("/edit_demand_post", async (req: Request, res: Response) => {
    const { id, owner_id, owner_name, title, description, price, category, location, created_at } = req.body;
    const criteria = { id: id };

    try {
        const post_data = new Demand_post(id, owner_id, owner_name, title, description, price, category, location, created_at);
        console.log(`ID of the edited demand post: ${id}`);
        console.log(`Title of edited demand post: ${title}`);

        await modify_data(table_name_demand_posts, post_data, criteria);
        res.status(200).json();
    } catch (error: any) {
        console.error("Failed to edit demand post:", error.message);
        res.status(500).json();
    }
});

router.post("/delete_demand_post", async (req: Request, res: Response) => {
    const { id } = req.body;

    try {

        await delete_data(table_name_demand_posts, { id: id });
        res.status(200).json();
    } catch (error: any) {
        console.error("Failed to delete demand post", error.message);
        res.status(500).json();
    }
});

// Is a GET request handler, i.e. used by the client to retrieve data from the server
// Handles all await axios.get(`${SERVER_URL}/retrieve_posts`);
router.get("/fetch_all_demand_posts", async (req: Request, res: Response) => {
    try {
        // Retrieves all the active demand posts
        // {} is used as a criteria to fetch all entries
        const all_demand_posts = await retrieve_data(table_name_demand_posts, {});
        res.status(200).json(all_demand_posts);
    } catch (error: any) {
        console.error("Error fetching demand posts", error.message);
        res.status(500).json();
    }
});

router.get("/fetch_my_demand_posts", async (req: Request, res: Response) => {
    const user_id = req.headers.auth;

    try {
        const condition = { owner_id: user_id };
        const demand_posts: Demand_post[] = await retrieve_data(table_name_demand_posts, condition);

        res.status(200).json(demand_posts);
    } catch (error) {
        res.status(500).json();
    }
});

router.get("/fetch_demand_post", async (req: Request, res: Response) => {
    const post_id = req.headers.auth;

    try {
        const condition = { id: post_id };
        const demand_posts: Demand_post[] = await retrieve_data(table_name_demand_posts, condition);

        res.status(200).json(demand_posts[0]);
    } catch (error) {
        res.status(500).json();
    }
});


export { router as demand_post_routes };