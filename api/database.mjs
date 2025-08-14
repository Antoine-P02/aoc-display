// database.js
import fs from 'fs';
import { MongoClient, ServerApiVersion } from 'mongodb';

const envContent = fs.readFileSync('../.env', 'utf8');
const db_password = envContent.match(/^VITE_DB_PASSWORD\s*=\s*(.*)$/m)[1].trim();
const uri = `mongodb+srv://dbP02:${db_password}@clusterp02.arl21aq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterP02`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function run() {
    try {
        console.log("run function called", uri);
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}


export async function getDb() {
    if (client.topology?.isConnected() !== true) {
        await client.connect();
    }

    const db = client.db("sample_guides");
    const collection = db.collection("planets");
    const planets = await collection.find({}).limit(10).toArray();
    console.log("Retrieved planets:", planets);
    return planets;
}

export async function getMessages(amount){
    if (client.topology?.isConnected() !== true) {
        await client.connect();
    }

    const db = client.db("aoc");
    const collection = db.collection("messages");
    const messages = await collection.find({}).limit(amount).toArray();
    console.log("Retrieved messages:", messages);
    return messages;
}

export async function sendMessage(message) {

    console.log("Trying to send message:", message);
    if (client.topology?.isConnected() !== true) {
        await client.connect();
    }
    

    const db = client.db("aoc");
    const collection = db.collection("messages");
    try {
        const result = await collection.insertOne(
            { 
                value: message,
                timestamp: new Date(),
            });
        console.log("Message sent:", result);
        return result;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}


export async function closeConnection() {
    try {
        await client.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }
}
