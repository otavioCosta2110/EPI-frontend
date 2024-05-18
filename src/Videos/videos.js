import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pagesCss.css';
import { useParams } from 'react-router-dom';

function Videos() {
  const [videos, setVideos] = useState([]);
  const apiURL = 'http://localhost:3000';

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`${apiURL}/video/getvideos`);
        const data = await response.json();
        if (data && data.data) {
          setVideos(data.data);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, []); 

  console.log(videos)
  
  return (
    <div className="videos">
      <div className="videos-list">
        {videos.length > 0 ? (
          videos.map(video => {
            const match = video.url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([^"&?/ ]{11})/);
            const videoId = match && match[1];

            return (
              <Link key={video.id} to={`/videos/${video.id}`} className="video-item">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <div className="video-info">
                  <h2 className="video-title">{video.title}</h2>
                  <p className="video-description">{video.description}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <p>No videos available</p>
        )}
      </div>
    </div>
  );
}

export default Videos;
