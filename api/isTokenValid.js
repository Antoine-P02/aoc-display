import { isTokenValid, CODES } from './functions.mjs'

export default async function handler(req, res) {
  const token = req.query.token
  const user = await isTokenValid(token)
  if (user in CODES) {
    return res.status(400).send(CODES[user])
  }
  res.status(200).send(user)
  // const token = req.query.token;
  // try {
  //     const isValid = await isTokenValid(token);
  //     if (!isValid) {
  //         return res.status(401).json({ error: 'Invalid token' });
  //     }
  //     res.status(200).json({ message: 'Token is valid' });
  // } 
  // catch (err) {
  //     console.error('api/isTokenValid error:', err);
  //     res.status(500).json({ error: err.message || 'Internal error' });
  // }
}
