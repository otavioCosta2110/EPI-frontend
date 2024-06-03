import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const apiURL = "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.log(token);
      fetchUserData(token);
    } catch (error) {
      setError("Erro ao enviar dados");
    }
  };

  const [user, setUser] = useState("");

  const fetchUserData = async (token) => {
    try {
      const token = Cookies.get("jwt");
      console.log("token epico:", token);
      const response = await fetch(`${apiURL}/user/loggeduser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      });

      const loggeduser = await response.json();

      const getUserResponse = await fetch(
        `${apiURL}/user/getuserbyemail?email=${loggeduser.data.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        }
      );
      console.log(loggeduser);

      const user = await getUserResponse.json();

      console.log("user:", user.data);
      setUser(user.data);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.data.role === "1") {
        window.location.href = "/";
      } else {
        console.log(user);
        window.location.href = "/adminPage";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        E-mail:
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Senha:
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        <Link to="/registerStudent">
          <a style={{ color: "black" }}>Ainda não possui uma conta?</a>
        </Link>
      </label>
      {error && <div className="error">{error}</div>}
      <input type="submit" value="Enviar" onClick={handleSubmit} />
    </form>
  );
}

export default Login;
