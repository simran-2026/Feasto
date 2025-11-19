import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3000/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount ?? 0,
                    // support older documents that used `saveCount`
                    savesCount: item.food.savesCount ?? item.food.saveCount ?? 0,
                    commentsCount: item.food.commentsCount ?? 0,
                    foodPartner: item.food.foodPartner,
                }))
                setVideos(savedFoods)
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
            // Prefer authoritative server count when provided
            const serverCount = response.data.savesCount
            if (typeof serverCount === 'number') {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: serverCount } : v))
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
            }
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved