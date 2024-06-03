import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./MaterialRegister.css";

function MaterialForm() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [video_id, setVideoId] = useState(id);

  const apiURL = "http://localhost:3000";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
      setType(selectedFile.type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !type || !file) {
      setError("Título, Tipo e Arquivo são obrigatórios");
      return;
    }

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("type", type);
      formData.set("description", description);
      formData.set("videoID", video_id);
      formData.set("file_url", file);

      const response = await fetch(`${apiURL}/material/create`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        const createdMaterialId = responseData.data.id;
        console.log("ID do material criado:", createdMaterialId);
        window.location.reload();
      } else {
        setError("Erro ao criar material");
      }
    } catch (error) {
      setError("Erro ao criar material");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        Título:
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        Descrição:
        <input
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        Arquivo:
        <input
          id="file_url"
          type="file"
          name="file_url"
          onChange={handleFileChange}
          className="input-field"
        />
      </div>
      <input type="submit" value="Criar Material" className="submit-button" />
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default MaterialForm;
