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
      <div className="header-column center-section">
        <Link to="/">
          <h1>EPI</h1>
        </Link>
        <div className="header-links">
        <Link to="/videos">
          <h3>🞄 Videos</h3>
        </Link>
        <Link to="/forums">
          <h3>🞄 Foruns</h3>
        </Link>

        </div>
      </div>
      <div className="header-column right-section">
        <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.5rem" }}/>
        {user ? (
          <div className="user-info">
            {user.data.role === "0" ? (
              <Link to="/adminPage">
                <span>{user.data.name}</span>
              </Link>
            ) : (
              <span onClick={handleLogout}>
                <Link to="/">       
                  {user.data.name}
                </Link>
              </span>
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
