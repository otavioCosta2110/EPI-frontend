import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./videos.css";
import SearchBar from "../Components/Searchbar.js";

const VIDEOS_PER_PAGE = 12;

function Videos() {
  const [user, setUser] = useState("");
  const [videos, setVideos] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("Videos");
  const [allVideos, setAllVideos] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!user || !user.data || !user.data.tags) {
      return videos.filter((video) =>
        selectedTag ? video.tags.includes(selectedTag) : true
      );
    }
    const selectedTags = user.data.tags;

    return videos
      .filter((video) =>
        selectedTag ? video.tags.includes(selectedTag) : true
      )
      .sort((a, b) => {
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

  const paginatedVideos = (videos) => {
    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    return videos.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    filterAndSortVideos(allVideos).length / VIDEOS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedTag(e.target.value);
    setCurrentPage(1);
    console.log(e.target.value);
  };

  const uniqueTags = Array.from(
    new Set(allVideos.flatMap((video) => video.tags))
  );

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
    setSearchActive(true);
    try {
      const response = await fetch(`${apiURL}/video/search/${searchTerm}`);
      const data = await response.json();
      if (data && data.data) {
        setVideos(data.data);
        setCurrentPage(1);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error searching videos:", error);
    }
  };

  const handleResetSearch = () => {
    setVideos(allVideos);
    setSearchTerm("");
    setSearchActive(false);
    setCurrentPage(1);
  };

  return (
    <div className="videos">
      <div className="video-history-tabs">
        <div className="left">
          <div className="filter">
            <label htmlFor="tagFilter">Filtrar por:</label>
            <select
              id="tagFilter"
              value={selectedTag}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="center">
          <button
            className={`toggle-button ${
              activeTab === "Videos" ? "active" : ""
            }`}
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
        <div className="right">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="videos-list">
        {activeTab === "Videos" && (
          <>
            {searchActive && videos.length === 0 ? (
              <div className="no-results">
                <p>Nenhum resultado encontrado para "{searchTerm}"</p>
                <button className="button" onClick={handleResetSearch}>
                  Voltar
                </button>
              </div>
            ) : (
              paginatedVideos(filterAndSortVideos(videos)).map((video) => {
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
              })
            )}
          </>
        )}

        {activeTab === "Histórico" && (
          <>
            <h2>Histórico</h2>
            {watchedVideos.length > 0 ? (
              paginatedVideos(filterAndSortVideos(watchedVideos)).map(
                (video) => {
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
                }
              )
            ) : (
              <p>Você não tem Histórico</p>
            )}
          </>
        )}
      </div>

      <div>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default Videos;
