import React from 'react';
import uncleBrada from '../assets/UncleBrada.jpg';
import '../css/UncleBrada.css';

const UncleBrada = () => {
  return (
    <div className="uncle-brada-container">
      <h1 className="title">Uncle Brada x Euphie</h1>
      
      <div className="image-flex-container">
        <div className="image-card">
          <img
            src={uncleBrada}
            alt="Uncle Brada"
            className="profile-image"
          />
          <div className="image-label">Uncle Brada</div>
        </div>
        
        <div className="heart-divider">❤️</div>
        
        <div className="image-card">
          <img 
            src="https://i.pinimg.com/originals/11/3a/c9/113ac9accc9fc19337dced9154f6b0ec.jpg" 
            alt="Euphie" 
            className="profile-image"
          />
          <div className="image-label">Euphie</div>
        </div>
      </div>
    </div>
  );
};

export default UncleBrada;