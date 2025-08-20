import { client } from "./database.mjs";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    try {
        const { message } = req.body || {}
        if (!message) return res.status(400).json({ error: 'Missing message' })
        console.log("Trying to send message:", message);
        if (client.topology?.isConnected() !== true) {
            await client.connect();
        }


        const timestamp = Date.now();
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log("ip ?", req.headers['x-forwarded-for'], req.socket.remoteAddress);

        const db = client.db("aoc");
        const collection = db.collection("messages");
        try {
            const result = await collection.insertOne(
                {
                    value: `${message} - ${timestamp} - ${ip}`,
                    timestamp: new Date(),
                });
            console.log("Message sent:", result);
            res.status(200).json({ success: true })
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
        
    } catch (err) {
        console.error('api/sendMessage error:', err)
        res.status(500).json({ error: err.message || 'Internal error' })
    }
}