import axios from "axios";

export default async function handler(req, res) {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ error: "Authorization code is missing" });
        }

        // Spotify Token API 请求
        const response = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "authorization_code",
                code,
                redirect_uri: "https://my-vercel-project-teal.vercel.app/api/spotifyCallback",
                client_id: process.env.SPOTIFY_CLIENT_ID, // 从环境变量中读取
                client_secret: process.env.SPOTIFY_CLIENT_SECRET, // 从环境变量中读取
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const { access_token, refresh_token } = response.data;

        // 返回令牌信息
        res.status(200).json({ access_token, refresh_token });
    } catch (error) {
        console.error("Spotify Callback Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
