// src/components/Carousel.js
import React, { useContext } from 'react';
import '../styles/Carousel.css';
import { SlideContext } from '../AdminPanel/context/SlideContext';

const Carousel = () => {
  const { slides } = useContext(SlideContext);

  return (
    <div className="carousel-container">
      <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="5000">
              <img src={slide.image} className="d-block w-100 carousel-image" alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
        <a className="carousel-control-prev" href="#carouselExampleInterval" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleInterval" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </a>
      </div>
    </div>
  );
};

export default Carousel;
 