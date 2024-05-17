import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFileAlt, faTrophy, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './adminPage.css';

function AdminPage() {
    return (
        <div>
          <div className="RegisterButton">
            <Link to='/register'>
              <span>Registrar Novo Administrador </span>
            </Link>
            <FontAwesomeIcon icon={faPenToSquare} />
          </div>
          <div className="container">
            <div className="square">
            <Link to='/registerVideo'>
              <a className='square-text'>
                <FontAwesomeIcon icon={faBook} size="3x" />
                <br />
                Alterar Aulas
              </a>
            </Link>  
            </div>
    
            <div className="square">
              <a className='square-text'>
                <FontAwesomeIcon icon={faFileAlt} size="3x" />
                <br />
                Alterar Materiais
              </a>
            </div>
    
            <div className="square">
              <a className='square-text'>
                <FontAwesomeIcon icon={faTrophy} size="3x" />
                <br />
                Alterar Desafios
              </a>
            </div>
          </div>
        </div>
      );
    };

export default AdminPage;

