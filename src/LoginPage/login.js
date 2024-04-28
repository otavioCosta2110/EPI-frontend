import React, { useEffect, useState } from 'react';
import './login.css';
import Cookies from 'js-cookie';

function AdminPage() {
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
          // Store JWT token in cookies
          Cookies.set('jwt', token);
          console.log(token)
          // Fetch user data using the token
          fetchUserData(token);


          // console.log(await response.json())
          // const getToken = Cookies.get('jwt');
          // console.log(getToken)
          // if (getToken) {
          //   fetchUserData(getToken);
          // }

          const data = await response.json();
        } catch (error) {
            setError('Erro ao enviar dados');
        }
    };

   const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const token = Cookies.get('jwt');
  //   console.log(token)
  //   if (token) {
  //     fetchUserData(token);
  //   }
  // }, []);

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
      console.log(await response.json())
    }catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      // Make a request to the server to authenticate the user
      const response = await fetch(`${apiURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      if (response.ok) {
        const { token } = await response.json();
        // Store JWT token in cookies
        Cookies.set('jwt', token);
        // Fetch user data using the token
        fetchUserData(token);
      } else {
        // Handle login errors
        setUser(null);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    // Remove JWT token from cookies
    Cookies.remove('jwt');
    setUser(null);
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
            <p>{user ? `Olá, ${user.name}!` : 'Faça login para acessar o sistema.'}</p>
        </form>
    );
}

export default AdminPage;
