// src/AdminPanel/context/SlideContext.js
import React, { createContext, useState, useEffect } from 'react';

import logoaf1 from '../../img/logoaf1.jpg';
import spgpaff from '../../img/logoaff.jpg';
import logoaf from '../../img/logoaf.jpg';
import ikuds from '../../img/ikuds.png';

export const SlideContext = createContext();

export const SlideProvider = ({ children }) => {
  const initialSlides = [
    { image: logoaf1, title: 'Logo AF1' },
    { image: spgpaff, title: 'Logo AFF' },
    { image: logoaf, title: 'Logo AF' },
    { image: ikuds, title: 'IKUD' },
  ];

  const [slides, setSlides] = useState(() => {
    const savedSlides = localStorage.getItem('slides');
    return savedSlides ? JSON.parse(savedSlides) : initialSlides;
  });

  useEffect(() => {
    localStorage.setItem('slides', JSON.stringify(slides));
  }, [slides]);

  const addSlide = (newSlide) => {
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (index) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  return (
    <SlideContext.Provider value={{ slides, addSlide, removeSlide }}>
      {children}
    </SlideContext.Provider>
  );
};
