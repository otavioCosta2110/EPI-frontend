import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFileAlt, faTrophy, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './adminPage.css';


function AdminPage() {
  const [user, setUser] = useState('');
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  return (
      user && user.data && user.data.role =='0' ? (
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
        ) : (
          <div>Você não possui autorização para essa função.</div>
      )
      );
    };

export default AdminPage;

