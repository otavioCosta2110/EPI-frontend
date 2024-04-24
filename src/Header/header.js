import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './header.css';

function Header({ style }) {
    return (
        <header className="header" style={style}>
        <Link to="/">
            <h1>EPI</h1>
        </Link>
        
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
