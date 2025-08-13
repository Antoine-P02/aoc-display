const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/aoc-user', (req, res) => {
	let SESSION = process.env.VITE_SESSION;
	let LEADERBOARD = process.env.VITE_LEADERBOARD;
	if (!SESSION || !LEADERBOARD) {
		// Fallback: try to read from .env manually
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
		} catch (e) {}
	}
	if (!SESSION || !LEADERBOARD) {
		return res.status(500).json({ error: 'SESSION or LEADERBOARD token not found in .env' });
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
