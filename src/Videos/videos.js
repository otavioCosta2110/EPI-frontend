import React from 'react';
import './videos.css';
import { Link } from 'react-router-dom';

const Videos = () => {
  return (
    <div>
      <div className="container">
        <Link to={'/videos/html'}>
        <div className="square">
          <a className='square-text'>
            <br />
            Html
          </a>
        </div>
        </Link>
        <Link to={'/videos/css'}>
        <div className="square">
          <a className='square-text'>
            <br />
            Css
          </a>
        </div>
        </Link>
        <Link to={'/videos/js'}>
        <div className="square">
          <a className='square-text'>
            <br />
            Javascript
          </a>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Videos;
