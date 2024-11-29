import axios from "axios";

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Authorization code is missing" });
    }

    try {
        // 获取访问令牌
        const tokenResponse = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "authorization_code",
                code,
                redirect_uri: "https://my-vercel-project-teal.vercel.app/api/spotifyCallback",
                client_id: "7caedb65ce7d4c909e5ce47fb0895357",
                client_secret: "83e0ec7c3f04411a890bf109a124d796",
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const { access_token, refresh_token } = tokenResponse.data;

        // 返回令牌信息给小程序
        res.status(200).json({ access_token, refresh_token });
    } catch (error) {
        console.error("Failed to fetch access token:", error.response.data);
        res.status(500).json({ error: "Failed to fetch access token" });
    }
}
