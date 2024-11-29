// /api/getRecommendedTracks.js

import axios from 'axios';

let accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export default async function handler(req, res) {
    try {
        // 首先尝试使用当前的 accessToken 获取数据
        let response;
        try {
            response = await fetchTopTracks(accessToken);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // 令牌过期，需要刷新令牌
                console.log('Access token expired, refreshing token...');
                accessToken = await refreshAccessToken(refreshToken);
                // 再次尝试获取数据
                response = await fetchTopTracks(accessToken);
            } else {
                throw error;
            }
        }

        // 返回数据给小程序
        res.status(200).json({ tracks: response.data.items });
    } catch (error) {
        console.error('Error fetching tracks:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
}

// 获取用户的顶级歌曲
async function fetchTopTracks(token) {
    return axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            limit: 10, // 获取前10首歌曲
        },
    });
}

// 刷新 access_token
async function refreshAccessToken(refreshToken) {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:
                    'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
            },
        }
    );

    const newAccessToken = response.data.access_token;

    // 更新 accessToken 变量
    accessToken = newAccessToken;

    // **注意：**由于 Vercel 的环境变量在运行时是只读的，无法在代码中更新。
    // 如果需要持久化存储新的 access_token，建议使用数据库或其他存储方式。

    return newAccessToken;
}
