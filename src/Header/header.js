import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEdit,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import Cookies from "js-cookie";

function Header({ style }) {
  const [user, setUser] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUser(user);

        const token = Cookies.get("jwt");

        try {
          const response = await fetch(
            `http://localhost:3000/user/getuserimage`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const blob = await response.blob();
            setImageBlob(blob);
          } else {
            console.error("Failed to fetch user image");
          }
        } catch (error) {
          console.error("Error fetching user image:", error);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt");
    setUser(null);
    localStorage.removeItem("user");
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
        {user ? (
          <div className="user-info">
            {imageBlob ? (
              <img
                src={URL.createObjectURL(imageBlob)}
                alt="User"
                className="profile-picture"
                onClick={togglePopup}
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                style={{ marginRight: "0.5rem", fontSize: "2rem", color: "white", cursor: "pointer"}}
                onClick={togglePopup}
              />
            )}
            {showPopup && (
              <div className="popup-menu">
                <Link to="/modifyUser">
                  <div className="popup-item">
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ marginRight: "0.5rem", color: "black" }}
                    />
                    Meu Perfil
                  </div>
                </Link>
                {user && user.data && user.data.role === "0" && (
                  <Link to="/adminPage">
                    <div className="popup-item">
                      <FontAwesomeIcon
                        icon={faHome}
                        style={{ marginRight: "0.5rem", color: "black" }}
                      />
                      Página de Admin
                    </div>
                  </Link>
                )}
                <Link to="/login">
                  <div className="popup-item" onClick={handleLogout}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      style={{ marginRight: "0.5rem" }}
                    />
                    Sair
                  </div>
                </Link>
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
