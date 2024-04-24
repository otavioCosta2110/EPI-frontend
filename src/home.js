import React from 'react';
import Header from './Header/header'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFileAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const ThreeSquares = () => {
  return (
    <div>
      <div className="container">
        <div className="square">
          <a className='square-text'>
            <FontAwesomeIcon icon={faBook} size="3x" />
            <br />
            Aulas
          </a>
        </div>

        <div className="square">
          <a className='square-text'>
            <FontAwesomeIcon icon={faFileAlt} size="3x" />
            <br />
            Materiais
          </a>
        </div>

        <div className="square">
          <a className='square-text'>
            <FontAwesomeIcon icon={faTrophy} size="3x" />
            <br />
            Desafios
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThreeSquares;
