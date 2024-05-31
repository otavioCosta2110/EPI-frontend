import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import "./VideosRegister.css";
//localhost:3001/videos/bae63634-189a-44b4-8ff1-bb8cf0192073/RegisterMaterial
function VideoRegister() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [user, setUser] = useState("");

  const apiURL = "http://localhost:3000";

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagResponse = await fetch(`${apiURL}/tag/gettags`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const tagsData = await tagResponse.json();
        const tagNames = tagsData.data.map((tag) => tag.name);
        setTags(tagNames);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && user.data && user.data.id) {
      setAdminId(user.data.id);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiURL}/video/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          url,
          description,
          tags: selectedTags,
          user_id: adminId,
        }),
      });
      if (response.ok) {
        window.location.href = "/adminPage";
      }
    } catch (error) {
      setError("Erro ao registrar vídeo");
    }
  };

  return user && user.data && user.data.role === "0" ? (
    <div className="card-container">
      <form onSubmit={handleSubmit}>
        <div>
          Título:
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          URL do vídeo:
          <input
            type="text"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          Descrição:
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          Tags:
          <Autocomplete
            multiple
            id="tags-combo-box"
            options={tags}
            className="autocomplete-container"
            renderInput={(params) => (
              <TextField
                {...params}
                className="autocomplete-input"
                label="Tags"
              />
            )}
            onChange={(event, newValue) => {
              setSelectedTags(newValue);
            }}
          />
        </div>
        <input
          type="submit"
          value="Registrar Vídeo"
          className="submit-button"
        />
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  ) : (
    <div>Você não possui autorização para essa função.</div>
  );
}

export default VideoRegister;
