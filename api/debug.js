export default function handler(req, res) {
  res.json({
    message: 'Debug endpoint working',
    env: {
      VITE_SESSION: process.env.VITE_SESSION ? 'SET' : 'NOT SET',
      VITE_LEADERBOARD: process.env.VITE_LEADERBOARD ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV
    }
  })
}
