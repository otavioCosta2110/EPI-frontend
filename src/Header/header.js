import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import Cookies from "js-cookie";

function Header({ style }) {
  const [user, setUser] = useState("");

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

  return (
    <header className="header" style={style}>
      <div className="header-column left-section">
        <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.5rem" }}/>
        {user ? (
          <div className="user-info">
            {user.data.role === "0" ? (
              <Link to="/adminPage">
                <span>{user.data.name}</span>
              </Link>
            ) : (
              <span>{user.data.name}</span>
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

      <div className="header-column center-section">
        <Link to="/">
          <h1>EPI</h1>
        </Link>
      </div>

      <div className="header-column right-section">
        {user && (
          <div className="Logout" onClick={handleLogout}>
            <Link to="/">
              <h3>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  style={{ marginRight: "0.5rem" }}
                />
                Sair
              </h3>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
