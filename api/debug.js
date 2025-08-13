module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  res.json({
    message: 'Debug endpoint working',
    env: {
      VITE_SESSION: process.env.VITE_SESSION ? 'SET' : 'NOT SET',
      VITE_LEADERBOARD: process.env.VITE_LEADERBOARD ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      allEnv: Object.keys(process.env).filter(key => key.includes('SESSION') || key.includes('LEADERBOARD') || key.includes('AOC'))
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    }
  })
}
