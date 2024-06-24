import React, { useState, useEffect } from "react";
import { Button, Modal, Box } from "@mui/material";
import Cookies from "js-cookie";
import "./ModifyUser.css";

function ModifyUser() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailForPassword, setEmailForPassword] = useState("");
  const [image, setImage] = useState(null);
  const [openNameModal, setOpenNameModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [error, setError] = useState("");

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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleOpenNameModal = () => setOpenNameModal(true);
  const handleCloseNameModal = () => {
    setOpenNameModal(false);
    setNewName("");
    setPassword("");
    setError("");
  };

  const handleOpenPasswordModal = () => setOpenPasswordModal(true);
  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setNewPassword("");
    setEmailForPassword("");
    setError("");
  };

  const handleOpenImageModal = () => setOpenImageModal(true);
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setImage(null);
    setError("");
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
        window.location.reload();
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
        window.location.reload();
      } else {
        setError("Erro ao atualizar senha");
      }
    } catch (error) {
      setError("Erro ao atualizar senha");
    }
  };

  const handleUpdateImage = async () => {
    const formData = new FormData();
    formData.append("image_url", image);

    try {
      const response = await fetch(`${apiURL}/user/updateimage`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Imagem atualizada com sucesso");
        window.location.reload();
      } else {
        setError("Erro ao atualizar imagem");
      }
    } catch (error) {
      setError("Erro ao atualizar imagem");
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
        <Button onClick={handleOpenNameModal} variant="contained" color="primary">
          Alterar Nome
        </Button>
      </div>
      <div className="profile-field">
        <label>Senha:</label>
        <Button onClick={handleOpenPasswordModal} variant="contained" color="primary">
          Alterar Senha
        </Button>
      </div>
      <div className="profile-field">
        <label>Imagem:</label>
        <Button onClick={handleOpenImageModal} variant="contained" color="primary">
          Alterar Imagem
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
            className="custom-input"
          />
          <input
            type="password"
            placeholder="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="custom-input"
          />
          <Button
            onClick={handleUpdatePassword}
            variant="contained"
            color="primary"
            disabled={!newPassword || !emailForPassword}
          >
            Confirmar
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openImageModal}
        onClose={handleCloseImageModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-box">
          <h2>Alterar Imagem</h2>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="custom-input"
          />
          <Button
            onClick={handleUpdateImage}
            variant="contained"
            color="primary"
            disabled={!image}
          >
            Confirmar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ModifyUser;
