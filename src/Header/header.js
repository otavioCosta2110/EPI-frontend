import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import Cookies from "js-cookie";

function Header({ style }) {
  const [user, setUser] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("User:", storedUser);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt");
    setUser(null);
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleMouseEnter = (event) => {
    event.target.textContent = "Sair";
  };

  const handleMouseLeave = (event) => {
    event.target.textContent = user.data.name;
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <header className="header" style={style}>
      <div className="header-column center-section">
        <h1>EPI</h1>

        <div className="header-links">
          <Link to="/">
            <h3>🞄 Videos</h3>
          </Link>
          <Link to="/forums">
            <h3>🞄 Fóruns</h3>
          </Link>
        </div>
      </div>
      <div className="header-column right-section">
        <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.5rem" }} />
        {user ? (
          <div className="user-info">
            {user.data.role === "0" ? (
              <Link to="/adminPage">
                <span>{user.data.name}</span>
              </Link>
            ) : (
              <span onClick={togglePopup}>
                {user.data.name}
              </span>
            )}
            {showPopup && (
              <div className="popup-menu">
                <Link to="/modifyUser">
                  <div className="popup-item">
                    <FontAwesomeIcon icon={faEdit} style={{ marginRight: "0.5rem", color: "black"}} />
                    Modificar Usuário
                  </div>
                </Link>
                <div className="popup-item" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: "0.5rem" }} />
                  Sair
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="login">
            <Link to="/login">
              <span>Login/Registro</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
