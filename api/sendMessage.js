import { sendMessage } from './database.mjs'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    try {
        const { message } = req.body || {}
        if (!message) return res.status(400).json({ error: 'Missing message' })
        await sendMessage(message)
        res.status(200).json({ success: true })
    } catch (err) {
        console.error('api/sendMessage error:', err)
        res.status(500).json({ error: err.message || 'Internal error' })
    }
}