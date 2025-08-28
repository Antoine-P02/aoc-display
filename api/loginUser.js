import {authCheck } from "./functions.mjs";

export default async function handler(req, res) {
    const userName = req.query.username;
    const password = req.query.password;
    try {

        const res = await authCheck(userName, password);
        console.log("Login response:", res);
        if (!res) {
            return
        }
        res.status(200).json({ user: res });
    } catch (err) {
        console.error('api/loginUser error:', err);
        res.status(500).json({ error: err.message || 'Internal error' });
    }
}