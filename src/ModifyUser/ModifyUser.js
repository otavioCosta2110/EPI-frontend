import React, { useState, useEffect } from "react";
import { Button, Autocomplete, Modal, Box } from "@mui/material";
import Cookies from "js-cookie";
import "./ModifyUser.css";

function ModifyUser() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [isTagsChanged, setIsTagsChanged] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [openNameModal, setOpenNameModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailForPassword, setEmailForPassword] = useState("");

  const apiURL = "http://localhost:3000";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiURL}/user/loggeduser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });
        const userData = await response.json();
        setUser(userData);
        setName(userData.data.name);
        setSelectedTags(userData.data.tags || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch(`${apiURL}/tag/gettags`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const tagsData = await response.json();
        const tagNames = tagsData.data.map((tag) => tag.name);
        setTags(tagNames);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchUserData();
    fetchTags();
  }, []);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#%&*$!])[A-Za-z\d@#%&*$!]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword));
    setIsPasswordChanged(true);
  };

  const handleOpenNameModal = () => {
    setOpenNameModal(true);
  };

  const handleCloseNameModal = () => {
    setOpenNameModal(false);
    setNewName("");
    setPassword("");
    setError("");
  };

  const handleOpenPasswordModal = () => {
    setOpenPasswordModal(true);
    setShowPasswordRules(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setNewPassword("");
    setEmailForPassword("");
    setError("");
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${apiURL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login/senha inválida");
      }
      const jsonToken = await response.json();
      const token = jsonToken.data;
      Cookies.set("jwt", token);
      window.location.reload();
    } catch (error) {
      setError("Login/senha inválida");
    }
  };

  const handleUpdateName = async () => {
    try {
      const response = await fetch(`${apiURL}/user/updatename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify({
          email: user.data.email,
          name: newName,
          password,
        }),
      });

      if (response.ok) {
        alert("Nome atualizado com sucesso");
        handleLogin(user.data.email, password);
        setNewName("");
        setPassword("");
        setOpenNameModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError("Erro ao atualizar nome");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(`${apiURL}/user/updatepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify({
          email: emailForPassword,
          password: newPassword,
        }),
      });
      if (response.ok) {
        alert("Senha atualizada com sucesso");
        setShowPasswordRules(false);
        setIsPasswordChanged(false);
        setNewPassword("");
        setEmailForPassword("");
        setOpenPasswordModal(false);
      } else {
        setError("Erro ao atualizar senha");
      }
    } catch (error) {
      setError("Erro ao atualizar senha");
    }
  };

  return (
    <div className="user-profile-container">
      <h2>Perfil do Usuário</h2>
      <div className="profile-field">
        <label>Email:</label>
        <span>{user.data?.email}</span>
      </div>
      <div className="profile-field">
        <label>Nome:</label>
        <span>{name}</span>
        <Button
          onClick={handleOpenNameModal}
          variant="contained"
          color="primary"
        >
          Alterar Nome
        </Button>
      </div>
      <div className="profile-field">
        <label>Senha:</label>
        <Button
          onClick={handleOpenPasswordModal}
          variant="contained"
          color="primary"
        >
          Alterar Senha
        </Button>
      </div>

      {error && <p className="error">{error}</p>}
      <Modal
        open={openNameModal}
        onClose={handleCloseNameModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-box">
          <h2>Alterar Nome</h2>
          <input
            type="text"
            placeholder="Novo Nome"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="custom-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="custom-input"
          />
          <Button
            onClick={handleUpdateName}
            variant="contained"
            color="primary"
            disabled={!newName || !password}
          >
            Confirmar
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openPasswordModal}
        onClose={handleClosePasswordModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-box">
          <h2>Alterar Senha</h2>
          <input
            type="email"
            placeholder="Email"
            value={emailForPassword}
            onChange={(e) => setEmailForPassword(e.target.value)}
            className="custom-input1"
          />
          <input
            type="password"
            placeholder="Nova Senha"
            value={newPassword}
            onChange={handlePasswordChange}
            className="custom-input"
          />
          {showPasswordRules && (
            <div className="password-rules">
              <ul>
                <li className={newPassword.length >= 8 ? "valid" : "invalid"}>
                  Pelo menos 8 caracteres
                </li>
                <li className={/\d/.test(newPassword) ? "valid" : "invalid"}>
                  Pelo menos um número
                </li>
                <li
                  className={/[A-Za-z]/.test(newPassword) ? "valid" : "invalid"}
                >
                  Pelo menos uma letra
                </li>
                <li
                  className={
                    /[@#%&*$!]/.test(newPassword) ? "valid" : "invalid"
                  }
                >
                  Pelo menos um caractere especial: #, $, %, &
                </li>
              </ul>
            </div>
          )}
          <Button
            onClick={handleUpdatePassword}
            variant="contained"
            color="primary"
            disabled={!isPasswordValid || !emailForPassword}
          >
            Confirmar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ModifyUser;
