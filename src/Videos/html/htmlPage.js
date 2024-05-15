import React from 'react';
import { Link } from 'react-router-dom';
import '../pagesCss.css';
function htmlPage() {
    const videos = [
        { 
            id: 1, 
            title: 'Vídeo 1', 
            description: 'Descrição do vídeo 1', 
            image: 'https://via.placeholder.com/150', 
            url: 'https://www.youtube.com/watch?v=video1' 
        },
        { 
            id: 2, 
            title: 'Vídeo 2', 
            description: 'Descrição do vídeo 2', 
            image: 'https://via.placeholder.com/150', 
            url: 'https://www.youtube.com/watch?v=video2' 
        },
        { 
            id: 3, 
            title: 'Vídeo 3', 
            description: 'Descrição do vídeo 3', 
            image: 'https://via.placeholder.com/150', 
            url: 'https://www.youtube.com/watch?v=video3' 
        },
        { 
            id: 3, 
            title: 'Vídeo 3', 
            description: 'Descrição do vídeo 3', 
            image: 'https://via.placeholder.com/150', 
            url: 'https://www.youtube.com/watch?v=video3' 
        },
        { 
            id: 3, 
            title: 'Vídeo 3', 
            description: 'Descrição do vídeo 3', 
            image: 'https://via.placeholder.com/150', 
            url: 'https://www.youtube.com/watch?v=video3' 
        },
        { 
            id: 3, 
            title: 'Vídeo 3', 
            description: 'Descrição do vídeo 3', 
            image: 'https://via.placeholder.com/150', 
            url: 'https://www.youtube.com/watch?v=video3' 
        },
        { 
            id: 3, 
            title: 'Vídeo 3', 
            description: 'Descrição do vídeo 3', 
            image: 'https://via.placeholder.com/150', 
            url: 'https://www.youtube.com/watch?v=video3' 
        },
        { 
            id: 3, 
            title: 'Vídeo 3', 
            description: 'Descrição do vídeo 3', 
            image: 'https://via.placeholder.com/150', 
            url: 'https://www.youtube.com/watch?v=video3' 
        },
        
    ];

    return (
        <div className="videos">
            <div className="videos-list">
                {videos.map(video => (
                    <a key={video.id} href={video.url} className="video-item">
                        <img src={video.image} alt={video.title} className="video-thumbnail" />
                        <div className="video-info">
                            <h2 className="video-title">{video.title}</h2>
                            <p className="video-description">{video.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default htmlPage;
