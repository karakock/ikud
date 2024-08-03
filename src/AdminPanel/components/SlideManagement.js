import React, { useState, useContext } from 'react';
import '../styles/SlideManagement.css';
import { SlideContext } from '../context/SlideContext';

const SlideManagement = () => {
  const { slides, addSlide, removeSlide } = useContext(SlideContext);
  const [newSlide, setNewSlide] = useState({ image: '', title: '' });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlide({ ...newSlide, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFileName(file ? file.name : '');
  };

  const handleAddSlide = () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addSlide({ image: reader.result, title: newSlide.title });
        setNewSlide({ image: '', title: '' });
        setFile(null);
        setFileName(''); // Formu sıfırlama
      };
      reader.readAsDataURL(file);
    } else {
      addSlide(newSlide);
      setNewSlide({ image: '', title: '' });
    }
  };

  const handleRemoveSlide = (index) => {
    removeSlide(index);
  };

  return (
    <div className="slide-management">
      <h2>Slayt Yönetimi</h2>
      <div className="slide-form">
        <input
          type="text"
          name="title"
          placeholder="Başlık"
          value={newSlide.title}
          onChange={handleInputChange}
        />
        <input
          type="file"
          onChange={handleFileChange}
        />
        {fileName && <p className="file-name">{fileName}</p>}
        <button onClick={handleAddSlide}>Ekle</button>
      </div>
      <div className="slide-list">
        {slides.map((slide, index) => (
          <div key={index} className="slide-item">
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <p className="slide-title">{slide.title}</p>
            <button className="remove-button" onClick={() => handleRemoveSlide(index)}>Kaldır</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideManagement;
