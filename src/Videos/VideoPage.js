import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Youtube from "react-youtube";
import "./VideoPage.css";

function VideoPage() {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [video, setVideo] = useState();
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(-1);

  const apiURL = "http://localhost:3000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
        userID: user.data.id,
        rating: newValue,
      };
      const response = await fetch(`${apiURL}/video/rate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
  };

  useEffect(() => {
    const markVideoAsWatched = async () => {
      try {
        const response = await fetch(`${apiURL}/video/play`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video_id: video.id,
            user_id: user.data.id,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          console.error("Failed to mark video as watched:", data.message);
        }
      } catch (error) {
        console.error("Error marking video as watched:", error);
      }
    };

    if (video) {
      markVideoAsWatched();
      console.log("Ta marcado");
    }
  }, [video, user]);

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

        <div className="video-tags">
          <h3>Tags:</h3>
          <p>{video.tags.join(", ")}</p>
        </div>

        <Box
          component="fieldset"
          mb={3}
          borderColor="transparent"
          className="rating-container"
        >
          <Typography component="legend" className="rating-label">
            Avalie:
          </Typography>
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
