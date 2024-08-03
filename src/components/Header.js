import React from 'react';
import '../styles/Header.css';
import bayrakGif from '../img/bayrak.gif';
import kudiImage from '../img/log10.png';

const Header = () => (
  <div className="header-container">
    <img src={bayrakGif} alt="Bayrak" className="header-logo" />
    <h1 className="header-title">İSTANBUL KUYUMCULAR DERNEĞİ</h1>
    <img src={kudiImage} alt="İKUD" className="header-logo" />
  </div>
);

export default Header;
