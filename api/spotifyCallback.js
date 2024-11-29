export default async function handler(req, res) {
    const { code, error } = req.query;

    if (error) {
        return res.status(400).json({ error });
    }

    if (!code) {
        return res.status(400).json({ error: "Authorization code missing" });
    }

    res.status(200).json({ message: "Received authorization code", code });
}