
import dotenv from "dotenv";
import * as crypto from "crypto";
dotenv.config();

// AES-256-CBC encryption

if (!process.env.AES_SECRET_KEY) {
    throw new Error("AES_SECRET_KEY is missing in environment variables");
}

const ENCRYPTION_KEY = Buffer.from(process.env.AES_SECRET_KEY, "hex");

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`; // Store IV with encrypted text
}

export function decrypt(encryptedText: string): string {
    if (!encryptedText || !encryptedText.includes(":")) {
        throw new Error("Invalid encrypted text format: Missing IV or ciphertext");
    }

    const [ivHex, encrypted] = encryptedText.split(":"); // Extract IV from stored data

    if (!ivHex || !encrypted) {
        throw new Error("Invalid encryption structure: IV or encrypted text is missing");
    }

    const iv = Buffer.from(ivHex, "hex"); // Convert IV back to binary
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
}

