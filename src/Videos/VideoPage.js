import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './VideoPage.css';
import Youtube from 'react-youtube';

function VideoPage() {
    const { id } = useParams();
    const [video, setVideo] = useState();
    const [relatedVideos, setRelatedVideos] = useState([]);

    const apiURL = 'http://localhost:3000';

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`${apiURL}/video/getbyid?id=${id}`); 
                const data = await response.json();
                setVideo(data.data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };
        
        fetchVideo();
    }, [id]);
    
    function getYouTubeVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return (match && match[1]) ? match[1] : null;
    }
    // useEffect(() => {
    //     const fetchRelatedVideos = async () => {
    //         try {
    //             const response = await fetch(`${apiURL}/videos`);
    //             const data = await response.json();
    //             setRelatedVideos(data.filter(item => item.id !== parseInt(id)));
    //         } catch (error) {
    //             console.error('Error fetching related videos:', error);
    //         }
    //     };

    //     fetchRelatedVideos();
    // }, [id]);
    console.log(video)
    if (!video) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            <div className="video-container">
                <Youtube
                    videoId={getYouTubeVideoId(video.url)}
                    opts={{
                        height: '390',
                        width: '640',
                        playerVars: {
                            autoplay: 1,
                        },
                    }}
                ></Youtube>
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
