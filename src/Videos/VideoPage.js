import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Youtube from "react-youtube";
import "./VideoPage.css";


function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState();
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(-1);

  const apiURL = "http://localhost:3000";

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`${apiURL}/video/getbyid?id=${id}`);
        const data = await response.json();
        setVideo(data.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [id]);

  function getYouTubeVideoId(url) {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${apiURL}/video/getvideos`);
        const data = await response.json();
        if (data && data.data) {
          setRelatedVideos(data.data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleUserRatingChange = async (event, newValue) => {
      try {
        const body = {
          videoID: video.id,
          rating: newValue,
        };
        const response = await fetch(`${apiURL}/video/rate`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          setUserRating(newValue);
        } else {
          console.error("Failed to rate video");
        }
      } catch (error) {
        console.error("Error rating video:", error);
      }
    console.log(video.id)
  };

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="video-page">
      <div className="video-container">
        <h1>
          {video.title.length > 30
            ? video.title.slice(0, 30) + "..."
            : video.title}
        </h1>

        <Youtube
          videoId={getYouTubeVideoId(video.url)}
          opts={{
            height: "390",
            width: "640",
            playerVars: {
              autoplay: 1,
            },
          }}
        />
        <p>
          {video.description.length > 50
            ? video.description.slice(0, 50) + "..."
            : video.description}
        </p>
     
      <Box component="fieldset" mb={3} borderColor="transparent" className="rating-container">
        <Typography component="legend" className="rating-label">Avalie:</Typography>
        <Rating
          name="video-user-rating"
          value={userRating}
          precision={0.5}
          onChange={handleUserRatingChange}
          onChangeActive={(event, newHover) => {
            setHoverRating(newHover);
          }}
        />
      </Box>
    </div>

      {relatedVideos.some((relatedVideo) =>
        relatedVideo.tags.some(
          (tag) => video.tags.includes(tag) && video.id !== relatedVideo.id
        )
      ) && (
        <div className="related-videos">
          <h2>Related Videos</h2>
          <div className="related-videos-list">
            {relatedVideos
              .filter((relatedVideo) =>
                relatedVideo.tags.some(
                  (tag) =>
                    video.tags.includes(tag) && video.id !== relatedVideo.id
                )
              )
              .map((relatedVideo) => (
                <Link
                  key={relatedVideo.id}
                  to={`/videos/${relatedVideo.id}`}
                  className="video-item"
                >
                  <img
                    src={`https://img.youtube.com/vi/${relatedVideo.id}/maxresdefault.jpg`}
                    alt={relatedVideo.title}
                    className="video-thumbnail"
                  />
                  <div className="video-info">
                    <h2 className="video-title">
                      {relatedVideo.title.length > 25
                        ? relatedVideo.title.slice(0, 25) + "..."
                        : relatedVideo.title}
                    </h2>
                    <p className="video-description">
                      {relatedVideo.description.length > 25
                        ? relatedVideo.description.slice(0, 25) + "..."
                        : relatedVideo.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPage;
