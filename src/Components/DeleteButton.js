import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./DeleteButton.css";
import Cookies from "js-cookie";

const DeleteButton = ({ videoID, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    const token = Cookies.get("jwt");
    try {
      const response = await fetch("http://localhost:3000/video/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: videoID }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onDelete(videoID);
          setShowConfirm(false);
        } else {
          console.error("Failed to delete video:", result.message);
        }
      } else {
        console.error("Failed to delete video:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="delete-button-container">
      <FontAwesomeIcon
        icon={faTrash}
        className="delete-icon"
        onClick={() => setShowConfirm(true)}
      />
      {showConfirm && (
        <div className="confirm-popup">
          <p>Deseja deletar o video?</p>
          <button className="confirm-button" onClick={handleDelete}>
            Confirmar
          </button>
          <button className="cancel-button" onClick={() => setShowConfirm(false)}>
            Voltar
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteButton;
