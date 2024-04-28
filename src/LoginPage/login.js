import React, { useEffect, useState } from 'react';
import './login.css';
import Cookies from 'js-cookie';
import Header from '../Header/header';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const apiURL = 'http://localhost:3000';

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiURL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar dados');
            }
          const jsonToken = await response.json();
          const token = jsonToken.data;
          Cookies.set('jwt', token);
          console.log(token)
          fetchUserData(token);
        } catch (error) {
            setError('Erro ao enviar dados');
        }
    };

   const [user, setUser] = useState('');

   const fetchUserData = async (token) => {
    try {
      const token = Cookies.get('jwt');
      console.log("token epico:", token)
      const response = await fetch(`${apiURL}/user/loggeduser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      });
      const user = await response.json()
      setUser(user.data);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = "/adminPage";
    }catch (error) {
      console.error('Error fetching user data:', error);
    }
    
  };
  
  const handleLogout = () => {
    Cookies.remove('jwt');
    setUser(null);
    //retirar do localStorage depois
  };
    return (
        <form onSubmit={handleSubmit}>
            <label>
                E-mail:
                <input 
                    type="text" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Senha:
                <input 
                    type="password" 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <div className="error">{error}</div>}
            <input type="submit" value="Enviar" onClick={handleSubmit} />
        </form>
    );
}

export default Login;
