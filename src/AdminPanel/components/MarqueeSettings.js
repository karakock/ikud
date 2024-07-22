import React, { useState } from 'react';
import '../styles/MarqueeSettings.css'; // CSS dosyasını içe aktarın

const MarqueeSettings = ({ marqueeText, setMarqueeText, scrollAmount, setScrollAmount, onSave }) => {
  const [message, setMessage] = useState('');

  const handleMarqueeTextChange = (e) => {
    setMarqueeText(e.target.value);
  };

  const handleScrollAmountChange = (e) => {
    setScrollAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(marqueeText, scrollAmount);
    setMessage('Ayarlar başarıyla kaydedildi!');
    setTimeout(() => setMessage(''), 3000); // Mesajı 3 saniye sonra temizle
  };

  return (
    <div className="marquee-settings-container">
      <h2>Kayan Yazı Ayarları</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="marqueeText">Kayan Yazı Metni:</label>
          <input
            type="text"
            id="marqueeText"
            value={marqueeText}
            onChange={handleMarqueeTextChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="scrollAmount">Kayma Hızı:</label>
          <input
            type="number"
            id="scrollAmount"
            value={scrollAmount}
            onChange={handleScrollAmountChange}
          />
        </div>
        <button className="save-button" type="submit">Ayarları Kaydet</button>
        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
};

export default MarqueeSettings;
