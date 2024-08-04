import React from 'react';
import '../styles/Header.css';
import bayrakGif from '../img/bayrak.gif';
import kudiImage from '../img/log10.png';

const Header = () => (
  <div className="header-container">
    <img src={bayrakGif} alt="Bayrak" className="header-logo float-effect" />
    <div className="header-content">
      <h1 className="header-title">
        İSTANBUL KUYUMCULAR DERNEĞİ
        <span className="underline"></span>
      </h1>
    </div>
    <img src={kudiImage} alt="İKUD" className="header-logo float-effect" />
  </div>
);

export default Header;
