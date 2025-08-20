import express from 'express';
import https from 'https';
import cors from 'cors';
import bodyParser from 'body-parser';
import { client } from '../api/functions.mjs';
import { run, getDb, closeConnection, authCheck, registerUser } from '../api/functions.mjs';
const app = express();
const PORT = 3001;

app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});

app.get('/api/db', async (req, res) => {
	try {
		console.log("call db file");
		await run();
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

app.get('/api/get-db', async (req, res) => {
	try {
		const db = await getDb();
		res.json({ success: true, dbName: db });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

app.get('/api/close-db', async (req, res) => {
	try {
		console.log("closing connection")
		await closeConnection();
		console.log("Connection closed", res.json({ success: true }));
	} catch (err) {
		console.error("Error closing MongoDB connection:", err);
	}
});

app.get('/api/aoc-user', (req, res) => {
	const options = {
		hostname: 'adventofcode.com',
		path: `/2024/leaderboard/private/view/${process.env.VITE_LEADERBOARD}.json`,
		headers: {
			'Cookie': `session=${process.env.VITE_SESSION}`,
			'User-Agent': 'Mozilla/5.0 (compatible; Node.js server)'
		}
	};

	https.get(options, (aocRes) => {
		let data = '';
		aocRes.on('data', chunk => { data += chunk; });
		aocRes.on('end', () => {
			if (aocRes.statusCode === 200) {
				res.type('application/json').send(data);
			} else {
				res.status(aocRes.statusCode).send(data);
			}
		});
	}).on('error', (err) => {
		res.status(500).json({ error: err.message });
	});
});

app.get('/api/getMessages', async (req, res) => {
	const limit = parseInt(req.query.limit);
	console.log("hello from Local", req.query.limit);
	console.log("Fetching messages with limit:", limit);
	console.log("Client not connected, connecting...", client.topology?.isConnected());
	try {
		const limit = parseInt(req.query?.limit ?? '100', 10) || 100
		if (client.topology?.isConnected() !== true) {
			await client.connect();
		}

		const db = client.db("aoc");
		const collection = db.collection("messages");
		const messages = await collection.find({}, { projection: { _id: 0, value: 1, images: 1, timestamp: 1, ip: 1 } }).limit(limit).toArray();

		res.json({
			messages: messages,
			ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

app.get('/api/getLastMessages', async (req, res) => {
	const limit = parseInt(req.query.limit);
	console.log("hello from Local", req.query.limit);
	console.log("Fetching messages with limit:", limit);
	console.log("Client not connected, connecting...", client.topology?.isConnected());
	try {
		const limit = parseInt(req.query?.limit ?? '100', 10) || 100
		if (client.topology?.isConnected() !== true) {
			await client.connect();
		}

		const db = client.db("aoc");
		const collection = db.collection("messages");
		const messages = await collection.find({}, { projection: { _id: 0, value: 1, images: 1, timestamp: 1, ip: 1 } }).sort({ _id: -1 }).limit(limit).toArray();

		res.json({
			messages: messages.reverse(),
			ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

app.post('/api/sendMessage', async (req, res) => {
	console.log("Received message:", req.body);
	const message = req.body.value;
	const images = req.body.images;
	console.log("Message:", message, "Images:", images);
	if (!message) return res.status(400).json({ error: 'Missing message' })
	console.log("Trying to send message:", message);
	if (client.topology?.isConnected() !== true) {
		await client.connect();
	}

	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	const db = client.db("aoc");
	const collection = db.collection("messages");
	try {
		const result = await collection.insertOne(
			{
				value: message,
				images: images || null,
				timestamp: new Date(),
				ip: ip
			});
		console.log("Message sent:", result);
		res.status(200).json({ success: true })
	} catch (error) {
		console.error("Error sending message:", error);
		throw error;
	}

});

app.get('/api/loginUser', async (req, res) => {
	const userName = req.query.username;
	const password = req.query.password;
	try {

		const rezzzz = await authCheck(userName, password);
		if (!rezzzz) {
			return
		}
		res.status(200).json({ user: rezzzz });
	} catch (err) {
		console.error('api/loginUser error:', err);
		res.status(500).json({ error: err.message || 'Internal error' });
	}
});

app.get('/api/registerUser', async (req, res) => {
	const userName = req.query.username;
	const password = req.query.password;
	console.log("Registering user:", userName, password);
	try {

		const rezzzz = await registerUser(userName, password);
		if (!rezzzz) {
			return res.status(400).json({ error: "User registration failed" });
		}

		res.status(201).json({ user: rezzzz });
	} catch (err) {
		console.error('api/registerUser error:', err);
		res.status(500).json({ error: err.message || 'Internal error' });
	}
});