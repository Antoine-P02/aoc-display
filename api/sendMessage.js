import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

const db_password = process.env.VITE_DB_PASSWORD;
const uri = `mongodb+srv://dbP02:${db_password}@clusterp02.arl21aq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterP02`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export default async function handler(req, res) {
    if (client.topology?.isConnected() !== true) {
        await client.connect();
    }

    const message = req.body.message;

    const db = client.db("aoc");
    const collection = db.collection("messages");
    try {
        const result = await collection.insertOne(
            {
                value: message,
                timestamp: new Date(),
            });
        console.log("Message sent:", result);
        res.status(200).json({ message: 'Hello from API!' });
        //return result;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
    
}


// export async function sendMessage(message) {

//     console.log("Trying to send message:", message);
//     if (client.topology?.isConnected() !== true) {
//         await client.connect();
//     }


//     const db = client.db("aoc");
//     const collection = db.collection("messages");
//     try {
//         const result = await collection.insertOne(
//             {
//                 value: message,
//                 timestamp: new Date(),
//             });
//         console.log("Message sent:", result);
//         return result;
//     } catch (error) {
//         console.error("Error sending message:", error);
//         throw error;
//     }
// }