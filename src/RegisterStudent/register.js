import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import "./register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [image, setImage] = useState(null);

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

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#%&*$!])[A-Za-z\d@#%&*$!]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("O arquivo é muito grande. O limite é de 5MB.");
    } else {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonClicked(true);

    if (!isPasswordValid) {
      setError("A senha não é válida.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", "1");
    if (image) {
      formData.append("image_url", image);
    }

    selectedTags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await fetch(`${apiURL}/user/create`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        setError(
          "Erro ao enviar dados: " + (errorData.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Network Error:", error);
      setError("Erro ao enviar dados: " + error.message);
    }
  };

  const renderPasswordRules = () => {
    const rules = [
      { text: "Pelo menos 8 caracteres", isValid: password.length >= 8 },
      { text: "Pelo menos um número", isValid: /\d/.test(password) },
      { text: "Pelo menos uma letra", isValid: /[A-Za-z]/.test(password) },
      {
        text: "Pelo menos um caractere especial: #, $, %, &",
        isValid: /[@#%&*$!]/.test(password),
      },
    ];

    return (
      <div className="password-rules">
        <ul>
          <li>A senha deve conter:</li>
          {rules.map(
            (rule, index) =>
              !rule.isValid && (
                <li key={index} className="invalid">
                  {rule.text}
                </li>
              )
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Foto de Perfil:
          <input type="file" onChange={handleImageChange} />
        </label>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          E-mail:
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className={isPasswordValid ? "" : "invalid"}
          />
        </label>
        {isButtonClicked && !isPasswordValid && renderPasswordRules()}
        <label>
          <Autocomplete
            multiple
            id="combo-box-demo"
            options={tags}
            className="autocomplete-container"
            renderInput={(params) => (
              <TextField
                {...params}
                className="autocomplete-input"
                label="Preferência"
              />
            )}
            onChange={(event, newValue) => {
              const newTags = newValue.map((option) => option.trim());
              setSelectedTags(newTags);
            }}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <input type="submit" value="Registrar" />
      </form>
    </div>
  );
}

export default Register;
