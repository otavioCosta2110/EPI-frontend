import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faFileAlt,
  faTrophy,
  faPenToSquare,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./adminPage.css";

function AdminPage() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt");
    setUser(null);
    localStorage.removeItem("user");
    window.location.reload();
  };

  return user && user.data && user.data.role == "0" ? (
    <div className="admin-page">
      <div className="Logout" onClick={handleLogout}>
      <Link to="/">
        <button className="logout-button">
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            style={{ marginRight: "0.5rem" }}
          />
          Sair
        </button>
      </Link>
      </div>
      <div className="container">
        <Link to="/register">
          <div className="square">
            <span className="square-text">
              <FontAwesomeIcon
                icon={faPenToSquare}
                size="3x"
                className="fa-icon"
              />
              <br />
              <br />
              Registrar Administrador
            </span>
          </div>
        </Link>
        <Link to="/registerVideo">
          <div className="square">
            <span className="square-text">
              <FontAwesomeIcon icon={faBook} size="3x" className="fa-icon" />
              <br />
              <br />
              Alterar Aulas
            </span>
          </div>
        </Link>
        <Link to="/registerChallenge">
          <div className="square">
            <span className="square-text">
              <FontAwesomeIcon icon={faTrophy} size="3x" className="fa-icon" />
              <br />
              <br />
              Alterar Desafios
            </span>
          </div>
        </Link>
        <Link to="/forums">
          <div className="square">
            <span className="square-text">
              <FontAwesomeIcon icon={faFileAlt} size="3x" className="fa-icon" />
              <br />
              <br />
              Forums
            </span>
          </div>
        </Link>
      </div>
    </div>
  ) : (
    <div>Você não possui autorização para essa função.</div>
  );
}

export default AdminPage;
