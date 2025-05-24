import express, { Request, Response } from "express";
import cors from "cors";
import delete_data from "./database/data_deletion";
import { table_name_supply_posts } from "./database/connection_pooling";
import { user_routes } from "./routes/user_route";
import { supply_post_routes } from "./routes/supply_post_routes";

const app = express();
const PORT = 3000;

// Middleware which enables automatic JSON parsing
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Enables cross-origin resource sharing
// i.e. enables the front end (different port) to communicate
// to the server
app.use(cors());// TODO: this is not safe in production

// Lets the server listen to routes defined under "/routes"
app.use(user_routes);
app.use(supply_post_routes);

app.post("/reset_table", async (req: Request, res: Response) => {
    try {
        await delete_data(table_name_supply_posts, {});
        res.status(200).json();
    } catch (error: any) {
		console.error("Failed to reset table", error.message);
        res.status(500).json();
    }
});

// Listens on the port 3000
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});