import { editMessage } from "./functions.mjs";

export default async function handler(req, res) {
	const messageId = req.body.messageId;
	const newMessage = req.body.newMessage;
	try {
		await editMessage(messageId, newMessage);
		res.status(200).json({ success: true });
	} 
    catch (err) {
		console.error('api/editMessage error:', err);
		res.status(500).json({ error: err.message || 'Internal error' });
	}
};