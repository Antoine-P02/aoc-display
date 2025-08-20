import { getMessages } from './database.mjs'

export default async function handler(req, res) {
    try {
        const limit = parseInt(req.query?.limit ?? '100', 10) || 100
        const messages = await getMessages(limit)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({ messages })
    } catch (err) {
        console.error('api/getMessages error:', err)
        res.status(500).json({ error: err.message || 'Internal error' })
    }
}