import React from 'react';
import './header.css';

function Header({ style }) {
    return (
        <header className="header" style={style}>
            <h1>EPI</h1>
        </header>
    );
}


export default Header;