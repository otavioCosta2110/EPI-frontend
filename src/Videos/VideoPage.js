import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Youtube from "react-youtube";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./VideoPage.css";

function VideoPage() {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [video, setVideo] = useState();
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(-1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [materials, setMaterials] = useState([]);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [ratingSuccessAlert, setRatingSuccessAlert] = useState(false);

  const apiURL = "http://localhost:3000";

  const showRatingSuccessAlert = () => {
    setRatingSuccessAlert(true);
    setTimeout(() => {
      setRatingSuccessAlert(false);
    }, 3000); // Define o tempo que o alerta será exibido (3 segundos)
  };

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleQuestionChange = (event) => setMessage(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiURL}/mail/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoid: video.id,
          userid: user.data.id,
          message,
        }),
      });
      if (response.ok) {
        setMessage("");
        handleClose();
      } else {
        console.error("Failed to submit question");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

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

    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          `${apiURL}/material/getmaterialbyvideo/${id}`
        );
        const data = await response.json();
        setMaterials(data.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchVideo();
    fetchMaterials();
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
        showRatingSuccessAlert();
      } else {
        console.error("Failed to rate video");
      }
    } catch (error) {
      console.error("Error rating video:", error);
    }
  };

  useEffect(() => {
    setUserRating(video ? video.rating : null);
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
    }
  }, [video, user]);

  if (!video) {
    return <div>Video não encontrado</div>;
  }

  const getUserById = async (userId) => {
    try {
      const response = await fetch(`${apiURL}/user/getuserbyid?id=${userId}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  function getVideoImage(videoUrl) {
    const match = videoUrl.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([^"&?/ ]{11})/
    );
    const videoId = match && match[1];
    const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return imageUrl;
  }

  const handleShowAllMaterials = () => {
    setShowAllMaterials(!showAllMaterials);
  };

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
        <div className="description-card">
          <p className="text">
            {showFullDescription
              ? video.description
              : video.description.length > 90
              ? video.description.slice(0, 90) + "..."
              : video.description}
            <br></br>
            {video.description.length > 90 && (
              <button onClick={handleToggleDescription}>
                {showFullDescription ? "Mostrar menos" : "Mostrar mais"}
              </button>
            )}
          </p>
        </div>
        <div className="video-tags">
          <h3>Assuntos:</h3>
          <div className="tag-container">
            {video.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {user && (
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
              size="large"
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#FFD700",
                },
                "& .MuiRating-iconHover": {
                  color: "#FFD700",
                },
              }}
            />
          </Box>
        )}
        <button color="primary" onClick={handleOpen} className="button">
          Tenho uma dúvida
        </button>
        <Modal open={open} onClose={handleClose}>
          <Box className="modal-container">
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" component="h2">
                Envie sua dúvida
              </Typography>
              <TextField
                label="Sua dúvida"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={message}
                onChange={handleQuestionChange}
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Enviar
              </Button>
            </form>
          </Box>
        </Modal>
      </div>

      <div className="related-videos">
        <h2>Vídeos Relacionados</h2>
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
                  src={`${getVideoImage(relatedVideo.url)}`}
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
        {user && user.data && user.data.role == "0" && (
          <Link to={`/videos/${id}/registermaterial`}>
            <div>
              <button className="button">Adicionar Materiais</button>
            </div>
          </Link>
        )}

        {materials.length > 0 && (
          <div className="materials-section">
            <h2>Materiais Relacionados</h2>
            <div className="materials-list">
              {materials.map(
                (material, index) =>
                  (index < 2 || showAllMaterials) && (
                    <div key={material.id} className="material-item">
                      <h3>{material.title}</h3>
                      <p className="text">{material.description}</p>
                      {material.type === "link" ? (
                        <a
                          href={material.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="material-link"
                        >
                          Acessar
                        </a>
                      ) : (
                        <a
                          href={`http://localhost:3000/material/download/${material.file_url}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="material-link"
                        >
                          Baixar
                        </a>
                      )}
                    </div>
                  )
              )}
            </div>
            {materials.length > 2 && (
              <input
                type="button"
                value={showAllMaterials ? "Mostrar menos" : "Mostrar mais"}
                onClick={handleShowAllMaterials}
                className="button"
              />
            )}
          </div>
        )}
        {ratingSuccessAlert && (
          <div className="success-alert show">Avaliado com sucesso</div>
        )}
      </div>
    </div>
  );
}

export default VideoPage;
