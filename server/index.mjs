import express from 'express';
import https from 'https';
import cors from 'cors';
import 'dotenv/config';
import { run, getDb, /*getMessages, sendMessage,*/ closeConnection } from '../api/database.mjs';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Non-fatal env check (helps when starting from /server instead of project root)
for (const k of ['VITE_SESSION', 'VITE_LEADERBOARD']) {
	if (!process.env[k]) {
		console.warn(`[env] ${k} is missing. Start the server from project root (npm run server) so .env is loaded.`);
	}	
}

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

// app.get('/api/getMessages', async (req, res) => {
// 	const limit = parseInt(req.query.limit);
// 	console.log("Fetching messages with limit:", limit);
// 	try {
// 		const messages = await getMessages(limit);
// 		res.json({ success: true, messages });
// 	} catch (err) {
// 		res.status(500).json({ success: false, error: err.message });
// 	}
// });

// app.post('/api/sendMessage', async (req, res) => {
// 	const message = req.body.message
// 	try {
// 		await sendMessage(message);
// 		res.json({ success: true });
// 	} catch (err) {
// 		res.status(500).json({ success: false, error: err.message });
// 	}
// });

// app.post('/api/sendMessage', async (req, res) => {
// 	console.log("bjr");
// 	const message = req.body.message;
// 	const timestamp = Date.now();
// 	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
// 	console.log("ip ?", req.headers['x-forwarded-for'], req.socket.remoteAddress);

// 	const concatenatedString = `${message} - ${timestamp} - ${ip}`;
// 	await sendMessage(concatenatedString);
// 	res.json({ success: true });

// 	//res.json({ message, timestamp, ip, location: locationData });
// });

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
	const SESSION = process.env.VITE_SESSION;
	const LEADERBOARD = process.env.VITE_LEADERBOARD;

	if (!SESSION || !LEADERBOARD) {
		return res.status(500).json({
			error: 'Missing VITE_SESSION or VITE_LEADERBOARD',
			sessionPresent: !!SESSION,
			leaderboardPresent: !!LEADERBOARD
		});
	}

	console.log('[aoc] fetching', `/2024/leaderboard/private/view/${LEADERBOARD}.json`);
	const options = {
		hostname: 'adventofcode.com',
		path: `/2024/leaderboard/private/view/${LEADERBOARD}.json`,
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
