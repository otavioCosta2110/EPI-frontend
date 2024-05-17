import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './VideoPage.css';

function VideoPage() {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);

    const apiURL = 'http://localhost:3000';

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`${apiURL}/video/${id}`); 
                const data = await response.json();
                setVideo(data);
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };

        fetchVideo();
    }, [id]);

    useEffect(() => {
        const fetchRelatedVideos = async () => {
            try {
                const response = await fetch(`${apiURL}/videos`);
                const data = await response.json();
                setRelatedVideos(data.filter(item => item.id !== parseInt(id)));
            } catch (error) {
                console.error('Error fetching related videos:', error);
            }
        };

        fetchRelatedVideos();
    }, [id]);

    if (!video) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            <div className="video-container">
                <iframe
                    src={video.url.replace('watch?v=', 'embed/')}
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    title={video.title}
                ></iframe>
            </div>
            <div className="related-videos">
                <h2>Vídeos Relacionados</h2>
                <ul>
                    {relatedVideos.map(item => (
                        <li key={item.id}>
                            <a href={`/video/${item.id}`}>{item.title}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default VideoPage;
