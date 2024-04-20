import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './header.css';

function Header({ style }) {
    return (
        <header className="header" style={style}>
            <h1>EPI</h1>
            <div className="login">
                <span>Login de Administrador</span>
                <FontAwesomeIcon icon={faUser} />
            </div>
        </header>
    );
}

export default Header;
