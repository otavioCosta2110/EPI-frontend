import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './header.css';

function Header({ style }) {
    const [user, setUser] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            console.log('User:', storedUser);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <header className="header" style={style}>
            <Link to="/">
                <h1>EPI</h1>
            </Link>
            {user ? (
                <div className="user-info">
                    <Link to='/adminPage'>
                        <span>{user.data.name}</span>
                    </Link>
                    <FontAwesomeIcon icon={faUser} />
                </div>
            ) : (
                <div className="login">
                    <Link to="/login">
                        <span>Login de Administrador</span>
                    </Link>
                    <FontAwesomeIcon icon={faUser} />
                </div>
            )}
        </header>
    );
}

export default Header;
