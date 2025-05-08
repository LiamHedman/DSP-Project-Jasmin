import { Request, Response } from "express";
import insert_data from "../database/data_insertion";
import retrieve_data from "../database/data_retrieval";
import { User } from "../../../common/src/classes"
import {  table_name_users } from "../database/connection_pooling";
import { app } from "./server_axios";


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

        const user_id = await retrieve_id(user.name);

        // Creates the auth token for the user
        let token = null;
        try {
            const jwt = require('jsonwebtoken');
            const payload = { id: user_id };
            // TODO: should be stored in a .env and not be hardcoded
            const secret_key = "temp_key";
            token = jwt.sign(payload, secret_key, {expiresIn: '12h'});
        } catch (error) {
            console.error("Failed to genereate session token for user");
        }

        console.log(`User "${user.name}" successfully logged in`);
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json();
    }
});