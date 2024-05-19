import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pagesCss.css';
import { useParams } from 'react-router-dom';

function Videos() {
  const [user, setUser] = useState('');
  const [videos, setVideos] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState([]);

  const apiURL = 'http://localhost:3000';

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
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
  
  const fetchWatchedVideos = async () => {
    try {
      const response = await fetch(`${apiURL}/video/watchedvideos?id=${user.data.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        const videosPromises = data.data.map(async video => {
          const responseVideos = await fetch(`${apiURL}/video/getbyid?id=${video.video_id}`); 
          const videoData = await responseVideos.json();
          return videoData.data;
        });  
        const videos = await Promise.all(videosPromises);
        setWatchedVideos(videos);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching watched videos:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWatchedVideos();
    }
  }, [user]);

  const isWatched = (videoId) => watchedVideos.some(video => video.id === videoId);

  return (
    <div className="videos">
      <div className="videos-list">
      <h2>Unwatched Videos</h2>
        {videos.length > 0 ? (
          videos.map(video => {
            const match = video.url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([^"&?/ ]{11})/);
            const videoId = match && match[1];

            if (!isWatched(video.id)) {
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
            }
            return null;
          })
        ) : (
          <p>No unwatched videos available</p>
        )}

        <h2>Watched Videos</h2>
        {watchedVideos.length > 0 ? (
          watchedVideos.map(video => {
            const match = video.url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([^"&?/ ]{11})/);
            const videoId = match && match[1];

            return (
              <Link key={video.id} to={`/videos/${video.id}`} className="video-item watched">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <div className="video-info">
                  <h2 className="video-title">{video.title}</h2>
                  <p className="video-description">{video.description}</p>
                </div>
                <br></br>
              </Link>
            );
          })
        ) : (
          <p>No watched videos available</p>
        )}
      
        
      </div>
    </div>
  );
}

export default Videos;
