import { deleteMessage } from './functions.mjs'

export default async function handler(req, res) {
  const message = req.body.value
  try {
    await deleteMessage(message)
    res.status(200).json({ success: true })
  } 
  catch (err) {
    console.error('api/deleteMessage error:', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
}
