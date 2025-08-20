import { client } from "./functions.mjs";

export default async function handler(req, res) {
    const userName = req.query.username;
    const password = req.query.password;
    try {
        
        if (client.topology?.isConnected() !== true) {
            await client.connect();
        }

        const user = {
            username: userName,
            password: hashPassword(password)
        }

        const db = client.db("aoc");
        const collection = db.collection("users");
        await collection.insertOne(user);
        res.status(201).json({ user });
    } catch (err) {
        console.error('api/registerUser error:', err);
        res.status(500).json({ error: err.message || 'Internal error' });
    }
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}