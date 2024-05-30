import React, { useState } from "react";
import "./RegisterMaterial.css";

function MaterialForm() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiURL = "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !type || !file) {
      setError("Título, Tipo e Arquivo são obrigatórios");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("file_url", file);

    try {
      const response = await fetch(`${apiURL}/material/create`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setType("");
        setDescription("");
        setFile(null);
        setError("");
        setSuccess("Material criado com sucesso");
      } else {
        setError("Erro ao criar material");
        setSuccess("");
      }
    } catch (error) {
      setError("Erro ao criar material");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <div>Título:</div>
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <div>Tipo:</div>
        <input
          id="type"
          type="text"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <div>Descrição:</div>
        <input
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <div>Arquivo:</div>
        <input
          id="file_url"
          type="file"
          name="file_url"
          onChange={(e) => setFile(e.target.files[0])}
          className="input-field"
        />
      </div>
      <input type="submit" value="Criar Material" className="submit-button" />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </form>
  );
}

export default MaterialForm;
