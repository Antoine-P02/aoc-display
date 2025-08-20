import { MongoClient, ServerApiVersion } from 'mongodb';

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db_password = process.env.VITE_DB_PASSWORD;
const uri = `mongodb+srv://dbP02:${db_password}@clusterp02.arl21aq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterP02`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
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

export async function closeConnection() {
    try {
        await client.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }
}


export async function authCheck(userName, password) {
    if (client.topology?.isConnected() !== true) {
        await client.connect();
    }
    const db = client.db("aoc");
    const collection = db.collection("users");
    const user = await collection.findOne({ username: userName });
    if (!user) {
        return false;
    }
    if (user.password !== password) {
        //if (user.password !== hashPassword(password)) {
        return false;
    }
    return user;
}

export async function registerUser(userName, password) {
    if (client.topology?.isConnected() !== true) {
        await client.connect();
    }

    const loginCheck = await authCheck(userName, password);
    console.log('registerUser loginCheck:', loginCheck);
    if (loginCheck == false) {
        return false;
    }

    const user = {
        username: userName,
        //password: hashPassword(password)
        password: password
    };

    const db = client.db("aoc");
    const collection = db.collection("users");
    await collection.insertOne(user);
    return user;
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
