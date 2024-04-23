// Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './header.css';

function Header({ style }) {
    return (
        <header className="header" style={style}>
            <h1>EPI</h1>

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
