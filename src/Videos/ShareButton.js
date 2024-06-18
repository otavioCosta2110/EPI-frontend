import React from 'react';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import './ShareButton.css';

function ShareButton({ videoUrl }) {
  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      videoUrl
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      videoUrl
    )}`;
    window.open(facebookUrl, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <div className="share-button-container">
      <Button onClick={shareOnWhatsApp} className="share-button whatsapp">
        <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
      </Button>
      <Button onClick={shareOnFacebook} className="share-button facebook">
        <FontAwesomeIcon icon={faFacebook} /> Facebook
      </Button>
      <Button onClick={copyLink} className="share-button copy">
        <FontAwesomeIcon icon={faCopy} /> Copiar Link
      </Button>
    </div>
  );
}

export default ShareButton;
