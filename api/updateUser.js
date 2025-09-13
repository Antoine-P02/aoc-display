import { updateUser, CODES } from './functions.mjs'

export default async function handler(req, res) {
    const modifiedUser = req.body

    const registration = await updateUser(modifiedUser)
    if (registration in CODES) {
        console.log('Update User error:', CODES[registration])
        return res.status(400).send(CODES[registration])
    }
    
    res.status(201).send(registration)
}