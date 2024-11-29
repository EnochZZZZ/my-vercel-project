import axios from "axios";
import qs from "qs";

export default async function handler(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      return res.status(500).json({ error: "Client ID or Client Secret is missing in environment variables" });
    }

    const token = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

    const data = qs.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://my-vercel-project-teal.vercel.app/api/spotifyCallback",
    });

    const response = await axios.post("https://accounts.spotify.com/api/token", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${token}`,
      },
    });

    const { access_token, refresh_token } = response.data;

    res.status(200).json({ access_token, refresh_token });
  } catch (error) {
    console.error("Spotify Callback Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
