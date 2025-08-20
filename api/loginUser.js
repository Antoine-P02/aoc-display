import { client } from "./functions.mjs";

export default async function handler(req, res) {
    const userName = req.query.username;
    const password = req.query.password;
    try {
        if (client.topology?.isConnected() !== true) {
            await client.connect();
        }

        const db = client.db("aoc");
        const collection = db.collection("users");
        const user = await collection.findOne({ username: userName });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (user.password !== password) {
        //if (user.password !== hashPassword(password)) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error('api/loginUser error:', err);
        res.status(500).json({ error: err.message || 'Internal error' });
    }
}   

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}