import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './header.css';

function Header({ style }) {
    return (
        <header className="header" style={style}>
            <div className="logo-container">
            <Link to="/">
                <h1 className="logo">EPI</h1>
            </Link>
            </div>
            <div className="login">
                <Link to="/login">
                    <span>Login de Administrador</span>
                </Link>
                <FontAwesomeIcon icon={faUser} />
            </div>
        </header>
    );
}

export default Header;
