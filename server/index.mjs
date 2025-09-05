import express from 'express'
import https from 'https'
import cors from 'cors'
import bodyParser from 'body-parser'
import { client } from '../api/functions.mjs'
import { CODES, closeConnection, getLastMessages, sendMessage, deleteMessage, editMessage, authCheck, registerUser, isTokenValid } from '../api/functions.mjs'
const app = express()
const PORT = 3001

app.use(cors())

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})

app.get('/api/close-db', async (req, res) => {
  try {
    console.log('closing connection')
    await closeConnection()
    console.log('Connection closed', res.json({ success: true }))
  } 
  catch (err) {
    console.error('Error closing MongoDB connection:', err)
  }
})

app.get('/api/aoc-user', (req, res) => {
  const options = {
    hostname: 'adventofcode.com',
    path: `/2024/leaderboard/private/view/${process.env.VITE_LEADERBOARD}.json`,
    headers: {
      Cookie: `session=${process.env.VITE_SESSION}`,
      'User-Agent': 'Mozilla/5.0 (compatible; Node.js server)'
    }
  }

  https
    .get(options, aocRes => {
      let data = ''
      aocRes.on('data', chunk => {
        data += chunk
      })
      aocRes.on('end', () => {
        if (aocRes.statusCode === 200) {
          res.type('application/json').send(data)
        } 
		else {
          res.status(aocRes.statusCode).send(data)
        }
      })
    })
    .on('error', err => {
      res.status(500).json({ error: err.message })
    })
})

app.get('/api/getMessages', async (req, res) => {
  const limit = parseInt(req.query.limit)
  console.log('hello from Local', req.query.limit)
  console.log('Fetching messages with limit:', limit)
  console.log('Client not connected, connecting...', client.topology?.isConnected())
  try {
    const limit = parseInt(req.query?.limit ?? '100', 10) || 100
    if (client.topology?.isConnected() !== true) {
      await client.connect()
    }

    const db = client.db('aoc')
    const collection = db.collection('messages')
    const messages = await collection
      .find({}, { projection: { _id: 0, value: 1, images: 1, timestamp: 1, ip: 1 } })
      .limit(limit)
      .toArray()

    res.json({
      messages: messages,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    })
  } 
  catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/getLastMessages', async (req, res) => {
  const limit = parseInt(req.query.limit)
  const skip = parseInt(req.query.skip)
  const messages = await getLastMessages(limit, skip)
  res.send({
    messages: messages.reverse(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  })
})

app.post('/api/sendMessage', async (req, res) => {
  console.log('Received message:', req.body)
  const message = req.body.value
  console.log('Message:', message)
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    await sendMessage(message, ip)
    res.status(200).json({ success: true })
  } 
  catch (error) {
    console.error('api/sendMessage error:', error)
    res.status(500).json({ error: error.message || 'Internal error' })
  }
})

app.post('/api/deleteMessage', async (req, res) => {
  const message = req.body.value
  try {
    await deleteMessage(message)
    res.status(200).json({ success: true })
  } 
  catch (err) {
    console.error('api/deleteMessage error:', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
})

app.post('/api/editMessage', async (req, res) => {
  const messageId = req.body.messageId
  const newMessage = req.body.newMessage
  console.log('Editing message from:', messageId, 'to:', newMessage)
  try {
    await editMessage(messageId, newMessage)
    res.status(200).json({ success: true })
  } 
  catch (err) {
    console.error('api/editMessage error:', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
})

app.get('/api/loginUser', async (req, res) => {
  const userName = req.query.username
  const password = req.query.password
  const registration = await authCheck(userName, password)
  if (registration in CODES) {
    console.log('Login error:', CODES[registration])
    return res.status(400).send(CODES[registration])
  }
  res.status(200).send(registration)
})

app.get('/api/registerUser', async (req, res) => {
  const userName = req.query.username
  const password = req.query.password
  console.log('Registering user:', userName, password)

  const registration = await registerUser(userName, password)
  if (registration in CODES) {
    console.log('Registration error:', CODES[registration])
    return res.status(400).send(CODES[registration])
  }

  res.status(201).send(registration)
})

app.get('/api/isTokenValid', async (req, res) => {
  const token = req.query.token
  const username = await isTokenValid(token)
  if (username in CODES) {
    console.log('Token validation error:', CODES[username])
    return res.status(400).send(CODES[username])
  }
  res.status(200).send(username)
})
