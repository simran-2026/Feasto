import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const Home = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        async function fetchVideos() {
            try {
                const response = await axios.get(`${API}/api/food`, { withCredentials: true })
                console.log('GET /api/food response:', response.data);
                const items = response.data.foodItems || response.data.foodItem || [];
                setVideos(items);
            } catch (err) {
                console.error('Failed to fetch videos', err?.response?.data ?? err?.message ?? err);
            }
        }
        fetchVideos();
    }, [])

    async function likeVideo(item) {
        try {
            const response = await axios.post(`${API}/api/food/like`, { foodId: item._id }, { withCredentials: true })
            const liked = response.data.like
            if (liked) {
                setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: (v.likeCount ?? 0) + 1 } : v))
            } else {
                setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 1) - 1) } : v))
            }
        } catch (err) {
            console.error('likeVideo failed:', err?.response?.data ?? err?.message ?? err)
        }
    }

    async function saveVideo(item) {
        try {
            const response = await axios.post(`${API}/api/food/save`, { foodId: item._id }, { withCredentials: true })
            const serverCount = response.data.savesCount
            if (typeof serverCount === 'number') {
                setVideos(prev => prev.map(v => v._id === item._id ? { ...v, savesCount: serverCount } : v))
            } else if (response.data.save) {
                setVideos(prev => prev.map(v => v._id === item._id ? { ...v, savesCount: (v.savesCount ?? 0) + 1 } : v))
            } else {
                setVideos(prev => prev.map(v => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
            }
        } catch (err) {
            console.error('saveVideo failed:', err?.response?.data ?? err?.message ?? err)
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home