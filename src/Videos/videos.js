import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./videos.css";
import { useParams } from "react-router-dom";

function Videos() {
  const [user, setUser] = useState("");
  const [videos, setVideos] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("Videos"); 
  const [allVideos, setAllVideos] = useState([]);

  const apiURL = "http://localhost:3000";

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
          setAllVideos(data.data); 
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, []);

  const fetchWatchedVideos = async () => {
    try {
      const response = await fetch(
        `${apiURL}/video/watchedvideos?id=${user.data.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        const videosPromises = data.data.map(async (video) => {
          const responseVideos = await fetch(
            `${apiURL}/video/getbyid?id=${video.video_id}`
          );
          const videoData = await responseVideos.json();
          return videoData.data;
        });
        const videos = await Promise.all(videosPromises);
        setWatchedVideos(videos);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching watched videos:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWatchedVideos();
    }
  }, [user]);

  const isWatched = (videoId) =>
    watchedVideos.some((video) => video.id === videoId);

  const filterAndSortVideos = (videos) => {
    if (!user || !user.data || !user.data.tags) return videos;
    const selectedTags = user.data.tags;

    return videos.sort((a, b) => {
      const aMatches = a.tags.some((tag) => selectedTags.includes(tag));
      const bMatches = b.tags.some((tag) => selectedTags.includes(tag));
      return bMatches - aMatches;
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="videos">
      <div className="video-history-tabs">
        <button
          className={`toggle-button ${activeTab === "Videos" ? "active" : ""}`}
          onClick={() => setActiveTab("Videos")}
        >
          Videos
        </button>
        <button
          className={`toggle-button ${
            activeTab === "Histórico" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Histórico")}
        >
          Histórico
        </button>
      </div>

      <div className="videos-list">
        {activeTab === "Videos" && (
          <>
            <h2>Todos os Vídeos</h2>
            {filterAndSortVideos(allVideos).map((video) => {
              const match = video.url.match(
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([^"&?/ ]{11})/
              );
              const videoId = match && match[1];

              return (
                <Link
                  key={video.id}
                  to={`/videos/${video.id}`}
                  className="video-item"
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <div className="video-info">
                    <h2 className="video-title">
                      {truncateText(video.title, 10)}
                    </h2>
                    <p className="video-description">
                      {truncateText(video.description, 10)}
                    </p>
                    <p>{video.tags.join(", ")}</p>
                  </div>
                </Link>
              );
            })}
          </>
        )}

        {activeTab === "Histórico" && (
          <>
            <h2>Histórico</h2>
            {watchedVideos.length > 0 ? (
              filterAndSortVideos(watchedVideos).map((video) => {
                const match = video.url.match(
                  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([^"&?/ ]{11})/
                );
                const videoId = match && match[1];

                return (
                  <Link
                    key={video.id}
                    to={`/videos/${video.id}`}
                    className="video-item watched"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={video.title}
                      className="video-thumbnail"
                    />
                    <div className="video-info">
                      <h2 className="video-title">
                        {truncateText(video.title, 10)}
                      </h2>
                      <p className="video-description">
                        {truncateText(video.description, 10)}
                      </p>
                      <p>{video.tags.join(", ")}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p>Você não tem Histórico</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Videos;
