import { updatePoll } from "./functions.mjs";

export default async function handler(req, res) {
    const messageId = req.body.messageId;
    const votes = req.body.votes;

    try {
        await updatePoll(messageId, votes);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating poll:', error);
        res.status(500).json({ error: error.message || 'Internal error' });
    }
}