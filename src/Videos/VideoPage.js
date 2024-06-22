import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Youtube from "react-youtube";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ShareButton from "../Components/ShareButton";
import "./VideoPage.css";
import Post from "../Components/Post";

function VideoPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [video, setVideo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [content, setContent] = useState("");
  const [hoverRating, setHoverRating] = useState(-1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [materials, setMaterials] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [showAllChallenges, setShowAllChallenges] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [ratingSuccessAlert, setRatingSuccessAlert] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemType, setDeleteItemType] = useState(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  const apiURL = "http://localhost:3000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchVideoData = async () => {
      try {
        const [
          videoResponse,
          materialsResponse,
          challengesResponse,
          relatedVideosResponse,
        ] = await Promise.all([
          fetch(`${apiURL}/video/getbyid?id=${id}`),
          fetch(`${apiURL}/material/getmaterialbyvideo/${id}`),
          fetch(`${apiURL}/challenge/getchallengebyvideo/${id}`),
          fetch(`${apiURL}/video/getvideos`),
        ]);

        const videoData = await videoResponse.json();
        const materialsData = await materialsResponse.json();
        const challengesData = await challengesResponse.json();
        const relatedVideosData = await relatedVideosResponse.json();

        setVideo(videoData.data);
        setMaterials(materialsData.data);
        setChallenges(challengesData.data);
        setRelatedVideos(relatedVideosData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchVideoData();

    const getPostsByVideo = async () => {
      const response = await fetch(`${apiURL}/post/getbyvideo/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const postsWithUsernames = await Promise.all(
        data.data.map(async (post) => {
          const responseGetUser = await fetch(
            `http://localhost:3000/user/getuserbyid?id=${post.user_id}`
          );
          const dataUser = await responseGetUser.json();
          return {
            ...post,
            userName: dataUser.data.name,
          };
        })
      );

      setPosts(postsWithUsernames);
    };

    getPostsByVideo();
  }, [id]);

  useEffect(() => {
    if (video) {
      setUserRating(video.rating);
      markVideoAsWatched();
    }
  }, [video]);
  const handleCreateResponse = async () => {
    const response = await fetch(`${apiURL}/post/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_id: id,
        user_id: user.data.id,
        content: content,
      }),
    });
    if (response.ok) {
      const newPost = await response.json();
      setPosts([{ ...newPost.data, userName: user.name }, ...posts]);
      setContent("");
      window.location.reload();
    }
  };

  const buildPostHierarchy = (posts) => {
    const postMap = {};
    const rootPosts = [];

    posts.forEach((post) => {
      post.responses = [];
      postMap[post.id] = post;
    });

    posts.forEach((post) => {
      if (post.post_id) {
        if (postMap[post.post_id]) {
          postMap[post.post_id].responses.push(post);
        }
      } else {
        rootPosts.push(post);
      }
    });

    return rootPosts;
  };

  const renderPosts = (posts) => {
    return posts.map((post) => (
      <div key={post.id} className="post">
        <Post post={post} user={user.data} video_id={id}></Post>
      </div>
    ));
  };

  const rootPosts = buildPostHierarchy(posts);

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
      if (!response.ok) {
        console.error("Failed to mark video as watched");
      }
    } catch (error) {
      console.error("Error marking video as watched:", error);
    }
  };

  const handleToggleDescription = () =>
    setShowFullDescription(!showFullDescription);
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

  const getYouTubeVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  };

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

  const showRatingSuccessAlert = () => {
    setRatingSuccessAlert(true);
    setTimeout(() => {
      setRatingSuccessAlert(false);
    }, 3000);
  };

  const getVideoImage = (videoUrl) => {
    const match = videoUrl.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([^"&?/ ]{11})/
    );
    const videoId = match && match[1];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleShowAllMaterials = () => setShowAllMaterials(!showAllMaterials);
  const handleShowAllChallenges = () =>
    setShowAllChallenges(!showAllChallenges);
  const handleToggleContent = (contentType) =>
    setShowChallenges(contentType === "challenges");

  const handleDelete = (type, id) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setConfirmDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    try {
      let endpoint;
      if (deleteItemType === "material") {
        endpoint = `${apiURL}/material/deletematerial/${deleteItemId}`;
      } else if (deleteItemType === "challenge") {
        endpoint = `${apiURL}/challenge/deletechallenge/${deleteItemId}`;
      } else {
        console.error("Invalid deleteItemType");
        return;
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (response.ok) {
        if (deleteItemType === "material") {
          setMaterials(
            materials.filter((material) => material.id !== deleteItemId)
          );
        } else if (deleteItemType === "challenge") {
          setChallenges(
            challenges.filter((challenge) => challenge.id !== deleteItemId)
          );
        }
        setConfirmDeleteModalOpen(false);
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (!video) {
    return <div>Video não encontrado</div>;
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
        <div className="description-card">
          <p className="text">
            {showFullDescription
              ? video.description
              : video.description.length > 90
              ? video.description.slice(0, 90) + "..."
              : video.description}
            <br />
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
        <p>
          Compartilhar com:
          <ShareButton videoUrl={video?.url} />
        </p>
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
                  fontSize: "2rem",
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
        <div className="posts-container">
          <h4>Comentários</h4>
          {user && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite sua resposta"
            />
          )}
          {user && (
            <button
              onClick={handleCreateResponse}
              className="create-response-button"
            >
              Criar Comentário
            </button>
          )}
          <div className="posts">{renderPosts(rootPosts)}</div>
        </div>
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
        <div className="materials-challenges-toggle">
          <button
            className={`toggle-button ${!showChallenges ? "active" : ""}`}
            onClick={() => handleToggleContent("materials")}
          >
            Materiais
          </button>
          <button
            className={`toggle-button ${showChallenges ? "active" : ""}`}
            onClick={() => handleToggleContent("challenges")}
          >
            Desafios
          </button>
        </div>
        {showChallenges ? (
          <div className="challenges-section">
            {user && user.data && user.data.role == "0" && (
              <Link
                to={`/videos/${id}/registerchallenge`}
                className="link-button"
              >
                <button className="button">Adicionar Desafios</button>
              </Link>
            )}
            {challenges.length > 0 ? (
              <div className="challenges-list">
                {challenges.map(
                  (challenge, index) =>
                    (index < 2 || showAllChallenges) && (
                      <div key={challenge.id} className="material-item">
                        <h3>{challenge.title}</h3>
                        <p className="text">{challenge.description}</p>
                        {challenge.type === "link" ? (
                          <a
                            href={challenge.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="material-link"
                          >
                            Acessar
                          </a>
                        ) : (
                          <a
                            href={`http://localhost:3000/challenge/download/${challenge.file_url}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="material-link"
                          >
                            Baixar
                          </a>
                        )}
                        {user && user.data && user.data.role == "0" && (
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() =>
                              handleDelete("challenge", challenge.id)
                            }
                            className="delete-icon"
                          />
                        )}
                      </div>
                    )
                )}
                {challenges.length > 2 && (
                  <button
                    type="button"
                    onClick={handleShowAllChallenges}
                    className="button"
                  >
                    {showAllChallenges ? "Mostrar menos" : "Mostrar mais"}
                  </button>
                )}
              </div>
            ) : (
              <p>Não há desafios relacionados.</p>
            )}
          </div>
        ) : (
          <div className="materials-section">
            {user && user.data && user.data.role == "0" && (
              <Link
                to={`/videos/${id}/registermaterial`}
                className="link-button"
              >
                <button className="button">Adicionar Materiais</button>
              </Link>
            )}
            {materials.length > 0 && (
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
                        {user && user.data && user.data.role == "0" && (
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() =>
                              handleDelete("material", material.id)
                            }
                            className="delete-icon"
                          />
                        )}
                      </div>
                    )
                )}
                {materials.length > 2 && (
                  <button
                    type="button"
                    onClick={handleShowAllMaterials}
                    className="button"
                  >
                    {showAllMaterials ? "Mostrar menos" : "Mostrar mais"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {ratingSuccessAlert && (
        <div className="success-alert show">Avaliado com sucesso</div>
      )}
      <Modal
        open={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
      >
        <Box className="modal-container">
          <Typography variant="h6" component="h2">
            Confirmar Exclusão
          </Typography>
          <Typography>
            Você tem certeza que deseja excluir este item?
          </Typography>
          <Button
            onClick={confirmDelete}
            variant="contained"
            style={{ backgroundColor: "red", color: "#fff" }}
          >
            Confirmar
          </Button>
          <Button
            onClick={() => setConfirmDeleteModalOpen(false)}
            variant="contained"
            className="cancel-button"
          >
            Cancelar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default VideoPage;
