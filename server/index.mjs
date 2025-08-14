import express from 'express';
import https from 'https';
import cors from 'cors';
import fs from 'fs';
import { run, getDb, getMessages, sendMessage, closeConnection } from '../api/database.mjs';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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

app.get('/api/getMessages', async (req, res) => {
	const limit = parseInt(req.query.limit);
	console.log("Fetching messages with limit:", limit);
	try {
		const messages = await getMessages(limit);
		res.json({ success: true, messages });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// app.post('/api/sendMessage', async (req, res) => {
// 	const message = req.body.message
// 	try {
// 		await sendMessage(message);
// 		res.json({ success: true });
// 	} catch (err) {
// 		res.status(500).json({ success: false, error: err.message });
// 	}
// });

app.post('/api/sendMessage', async (req, res) => {
	console.log("bjr");
	const message = req.body.message;
	const timestamp = Date.now();
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	console.log("ip ?", req.headers['x-forwarded-for'], req.socket.remoteAddress);

	const concatenatedString = `${message} - ${timestamp} - ${ip}`;
	await sendMessage(concatenatedString);
	res.json({ success: true });

	//res.json({ message, timestamp, ip, location: locationData });
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
	let SESSION, LEADERBOARD;
	try {
		const envContent = fs.readFileSync('../.env', 'utf8');
		const sessionMatch = envContent.match(/^VITE_SESSION\s*=\s*(.*)$/m);
		const leaderboardMatch = envContent.match(/^VITE_LEADERBOARD\s*=\s*(.*)$/m);
		if (sessionMatch) {
			SESSION = sessionMatch[1].trim();
		}
		if (leaderboardMatch) {
			LEADERBOARD = leaderboardMatch[1].trim();
		}
	} catch (e) {
		console.error("Error reading .env file:", e);
	}

	// Use only the numeric part of the leaderboard ID
	const leaderboardId = LEADERBOARD.split('-')[0];
	const options = {
		hostname: 'adventofcode.com',
		path: `/2024/leaderboard/private/view/${leaderboardId}.json`,
		headers: {
			'Cookie': `session=${SESSION}`,
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

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
