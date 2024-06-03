import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faFileAlt, faTrophy } from "@fortawesome/free-solid-svg-icons";
import "./home.css";
import { Link } from "react-router-dom";

const ThreeSquares = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <div className="container">
        <Link to="/videos">
          <div className="square">
            <a className="square-text">
              <FontAwesomeIcon icon={faBook} size="3x" className="fa-icon" />
              <br />
              <br />
              Aulas
            </a>
          </div>
        </Link>
        <Link to="/forums">
          <div className="square">
            <a className="square-text">
              <FontAwesomeIcon icon={faFileAlt} size="3x" className="fa-icon" />
              <br />
              <br />
              Fóruns
            </a>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ThreeSquares;
