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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError(
        "Senha deve conter pelo menos oito caracteres, entre letras, números e um caractere especial."
      );
      return;
    }

    try {
      const response = await fetch(`${apiURL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "1",
          tags: selectedTags,
        }),
      });
      if (response.ok) {
        window.location.href = "/login";
      } else {
        setError("Erro ao enviar dados");
      }
    } catch (error) {
      setError("Erro ao enviar dados");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
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
        <div className="password-rules">
          <ul>
            <li>A senha deve conter: </li>
            <li className={password.length >= 8 ? "valid" : "invalid"}>
              Pelo menos 8 caracteres
            </li>
            <li className={/\d/.test(password) ? "valid" : "invalid"}>
              Pelo menos um número
            </li>
            <li className={/[A-Za-z]/.test(password) ? "valid" : "invalid"}>
              Pelo menos uma letra
            </li>
            <li className={/[@#%&*$!]/.test(password) ? "valid" : "invalid"}>
              Pelo menos um caractere especial: #, $, %, &
            </li>
          </ul>
        </div>
        {error && <p className="error">{error}</p>}
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
              setSelectedTags(newValue);
            }}
          />
        </label>
        <input type="submit" value="Registrar" />
      </form>
    </div>
  );
}

export default Register;
