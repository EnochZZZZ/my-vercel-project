import axios from 'axios';

export default async function handler(req, res) {
  const client_id = '7caedb65ce7d4c909e5ce47fb0895357'; // Replace with your Spotify Client ID
  const client_secret = '83e0ec7c3f04411a890bf109a124d796'; // Replace with your Spotify Client Secret

  // Spotify token endpoint
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  // Base64 encode client ID and client secret
  const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Respond with the access token and related details
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Spotify access token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Spotify access token' });
  }
}
