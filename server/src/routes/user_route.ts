import express, { Request, Response } from "express";
import retrieve_data from "../database/data_retrieval";
import { table_name_users } from "../database/connection_pooling";
import { User } from "../../../common/src/classes";
import insert_data from "../database/data_insertion";
import delete_data from "../database/data_deletion";
import modify_data from "../database/data_modification";

const router = express.Router();

async function username_in_use(username: string): Promise<boolean> {
    const conditions = {
        name: username
    };
    const result = await retrieve_data(table_name_users, conditions);
    return result.length;
}

async function mail_in_use(mail: string): Promise<boolean> {
    const conditions = {
        mail: mail
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

async function retrieve_id(username: string): Promise<string> {
    const conditions = {
        name: username
    };
    const result = await retrieve_data(table_name_users, conditions);
    console.log(`retrieved id: ${result[0].id}`);
    return result[0].id;
}

// Handles register user request from the client
// Listens to all axios.post(`${SERVER_URL}/register_user` from the client
router.post("/register_user", async (req: Request, res: Response) => {
    const user: User = req.body;
    
    try {
        if (await username_in_use(user.name)) { 
            return res.status(418).json();
        }
        if (await mail_in_use(user.mail)) {
            return res.status(419).json();
        }

        console.log(`User "${user.name}" registered`);
        await insert_data(table_name_users, user);
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
});

router.post("/delete_user", async (req: Request, res: Response) => {
    const user_id = req.headers.auth;

    try {
        console.log(`User "${user_id}" set up for deletion`);
        const condition = { id: user_id };
        await delete_data(table_name_users, condition);
        
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
});

router.post("/modify_user", async (req: Request, res: Response) => {
    const user_id = req.headers.auth;
    const new_user_data: User = req.body;

    try {
        console.log(`User "${user_id}" set up for modification`);
        const condition = { id: user_id };
        await modify_data(table_name_users, new_user_data, condition);
        
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
});

router.get("/fetch_user", async (req: Request, res: Response) => {
    const user_id = req.headers.auth;

    try {
        console.log(`User "${user_id}" fetch from client`);
        const condition = { id: user_id };
        const users = await retrieve_data(table_name_users, condition);
        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(users[0]);
    } catch (error) {
        res.status(500).json();
    }
});

// Handles login requests from the client
// Listens to all axios.post(`${SERVER_URL}/login` from the client
router.post("/login", async (req: Request, res: Response) => {
	const user = req.body;
    
	try {
        if (!await username_in_use(user.name)) { throw new Error("User with this username doesnt exist"); }
        if (!await check_password(user.password, user.name)) { throw new Error("The password is incorrect for this username"); }

        const user_id = await retrieve_id(user.name);

        console.log(`User "${user.name}" successfully logged in`);
        console.log(`User has ID: "${user_id}"`);
        
        res.status(200).json(user_id);
    } catch (error) {
        res.status(500).json();
    }
});

export { router as user_routes };