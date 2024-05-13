import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import { handleLogout } from "../LoginPage/login";
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
  };

  return (
    <header className="header" style={style}>
      {user ? (
        <div className="user-info">
          {user.data.role === "0" ? (
            <Link to="/adminPage">
              <span>{user.data.name}</span>
            </Link>
          ) : (
            <span>{user.data.name}</span>
          )}
          <FontAwesomeIcon icon={faUser} />
        </div>
      ) : (
        <div className="login">
          <Link to="/login">
            <span>Login/Registro</span>
          </Link>
          <FontAwesomeIcon icon={faUser} />
        </div>
      )}

      <div className="logo-container">
        <Link to="/">
          <h1>EPI</h1>
        </Link>
      </div>

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
    </header>
  );
}

export default Header;
