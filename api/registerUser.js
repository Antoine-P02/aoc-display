import { registerUser, CODES } from './functions.mjs'

export default async function handler(req, res) {
  const userName = req.query.username
  const password = req.query.password
  console.log('Registering user:', userName, password)

  const registration = await registerUser(userName, password)
  if (registration in CODES) {
    console.log('Registration error:', CODES[registration])
    return res.status(400).send(CODES[registration])
  }

  res.status(201).send(registration)
  // const userName = req.body.username;
  // const password = req.body.password;
  // console.log('api/registerUser', userName, password, req, req.body, req.query);
  // try {

  //     const res = await registerUser(userName, password);
  //     if (!res) {
  //         return res.status(400).json({ error: "User registration failed" });
  //     }

  //     res.status(201).json({ user: res });
  // } 
  // catch (err) {
  //     console.error('api/registerUser error:', err);
  //     res.status(500).json({ error: err.message || 'Internal error' });
  // }
}
