import { sendMessage } from './functions.mjs'

export default async function handler(req, res) {
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
  // try {
  //     const { message } = req.body || {}
  //     if (!message) return res.status(400).json({ error: 'Missing message' })
  //     console.log("Trying to send message:", message);
  //     if (client.topology?.isConnected() !== true) {
  //         await client.connect();
  //     }

  //     const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  //     console.log("ip ?", req.headers['x-forwarded-for'], req.socket.remoteAddress);

  //     const db = client.db("aoc");
  //     const collection = db.collection("messages");
  //     try {
  //         const result = await collection.insertOne(
  //             {
  //                 value: message,
  //                 timestamp: new Date(),
  //                 ip: ip
  //             });
  //         console.log("Message sent:", result);
  //         res.status(200).json({ success: true })
  //     } 
  // catch (error) {
  //         console.error("Error sending message:", error);
  //         throw error;
  //     }

  // } 
  // catch (err) {
  //     console.error('api/sendMessage error:', err)
  //     res.status(500).json({ error: err.message || 'Internal error' })
  // }
}
