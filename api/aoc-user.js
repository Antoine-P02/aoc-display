import https from 'https'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const SESSION = process.env.VITE_SESSION
  const LEADERBOARD = process.env.VITE_LEADERBOARD

  console.log('Environment variables:', { 
    SESSION: SESSION ? 'SET' : 'NOT SET', 
    LEADERBOARD: LEADERBOARD ? 'SET' : 'NOT SET' 
  })

  if (!SESSION || !LEADERBOARD) {
    return res.status(500).json({ 
      error: 'SESSION or LEADERBOARD token not found in environment variables',
      sessionExists: !!SESSION,
      leaderboardExists: !!LEADERBOARD
    })
  }

  const leaderboardId = LEADERBOARD
  const options = {
    hostname: 'adventofcode.com',
    path: `/2024/leaderboard/private/view/${leaderboardId}.json`,
    headers: {
      'Cookie': `session=${SESSION}`,
      'User-Agent': 'Mozilla/5.0 (compatible; Vercel serverless function)'
    }
  }

  https.get(options, (aocRes) => {
    let data = ''
    aocRes.on('data', chunk => { data += chunk })
    aocRes.on('end', () => {
      console.log('AOC response status:', aocRes.statusCode)
      if (aocRes.statusCode === 200) {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.status(200).send(data)
      } else {
        console.log('AOC error response:', data)
        res.status(aocRes.statusCode).json({ 
          error: 'AOC API error', 
          status: aocRes.statusCode, 
          data: data 
        })
      }
    })
  }).on('error', (err) => {
    console.log('HTTPS request error:', err.message)
    res.status(500).json({ error: err.message })
  })
}
