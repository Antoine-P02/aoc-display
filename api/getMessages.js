import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

const db_password = process.env.VITE_DB_PASSWORD;
const uri = `mongodb+srv://dbP02:${db_password}@clusterp02.arl21aq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterP02`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const db = client.db("aoc");
    const collection = db.collection("messages");
    const messages = await collection.find({}).limit(amount).toArray();
    console.log("Retrieved messages:", messages);
    //return messages;

    res.status(200).json({ message: 'Hello from API!' });
}

// export async function getMessages(amount){
//     if (client.topology?.isConnected() !== true) {
//         await client.connect();
//     }

//     const db = client.db("aoc");
//     const collection = db.collection("messages");
//     const messages = await collection.find({}).limit(amount).toArray();
//     console.log("Retrieved messages:", messages);
//     return messages;
// }

// export default function handler(req, res) {


//   console.log('Environment variables:', { 
//     SESSION: SESSION ? 'SET' : 'NOT SET', 
//     LEADERBOARD: LEADERBOARD ? 'SET' : 'NOT SET' 
//   })

//   if (!SESSION || !LEADERBOARD) {
//     return res.status(500).json({ 
//       error: 'SESSION or LEADERBOARD token not found in environment variables',
//       sessionExists: !!SESSION,
//       leaderboardExists: !!LEADERBOARD
//     })
//   }

//   const leaderboardId = LEADERBOARD.split('-')[0]
//   const options = {
//     hostname: 'adventofcode.com',
//     path: `/2024/leaderboard/private/view/${leaderboardId}.json`,
//     headers: {
//       'Cookie': `session=${SESSION}`,
//       'User-Agent': 'Mozilla/5.0 (compatible; Vercel serverless function)'
//     }
//   }

//   https.get(options, (aocRes) => {
//     let data = ''
//     aocRes.on('data', chunk => { data += chunk })
//     aocRes.on('end', () => {
//       console.log('AOC response status:', aocRes.statusCode)
//       if (aocRes.statusCode === 200) {
//         res.setHeader('Content-Type', 'application/json')
//         res.setHeader('Access-Control-Allow-Origin', '*')
//         res.setHeader('Access-Control-Allow-Methods', 'GET')
//         res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
//         res.status(200).send(data)
//       } else {
//         console.log('AOC error response:', data)
//         res.status(aocRes.statusCode).json({ 
//           error: 'AOC API error', 
//           status: aocRes.statusCode, 
//           data: data 
//         })
//       }
//     })
//   }).on('error', (err) => {
//     console.log('HTTPS request error:', err.message)
//     res.status(500).json({ error: err.message })
//   })
// }