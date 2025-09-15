import { authCheck, CODES } from './functions.mjs'

export default async function handler(req, res) {
  const userName = req.query.username
  const password = req.query.password
  const registration = await authCheck(userName, password)
  if (registration in CODES) {
    return res.status(400).send(CODES[registration])
  }
  res.status(200).send(registration)
  // const userName = req.query.username;
  // const password = req.query.password;
  // try {

  //     const res = await authCheck(userName, password);
  //     console.log("Login response:", res);
  //     if (!res) {
  //         return
  //     }
  //     res.status(200).json({ user: res });
  // } 
  // catch (err) {
  //     console.error('api/loginUser error:', err);
  //     res.status(500).json({ error: err.message || 'Internal error' });
  // }
}
