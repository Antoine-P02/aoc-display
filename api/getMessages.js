import { client } from './functions.mjs'

export default async function handler(req, res) {
  try {
    const limit = parseInt(req.query?.limit ?? '100', 10) || 100
    if (client.topology?.isConnected() !== true) {
      await client.connect()
    }

    const db = client.db('aoc')
    const collection = db.collection('messages')
    const messages = await collection
      .find({}, { projection: { _id: 0, value: 1, timestamp: 1, ip: 1 } })
      .limit(limit)
      .toArray()
    const responseItem = {
      messages: messages,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(responseItem)
  } 
  catch (err) {
    console.error('api/getMessages error:', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
}
