import React, { useState, useEffect } from 'react';
import '../styles/MarqueeSettings.css'; // CSS dosyasını içe aktarın

const MarqueeSettings = ({ marqueeText, setMarqueeText, scrollAmount, setScrollAmount, onSave }) => {
  const [localMarqueeText, setLocalMarqueeText] = useState(marqueeText);
  const [localScrollAmount, setLocalScrollAmount] = useState(scrollAmount);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedMarqueeText = localStorage.getItem('marqueeText');
    const savedScrollAmount = localStorage.getItem('scrollAmount');

    if (savedMarqueeText) {
      setLocalMarqueeText(savedMarqueeText);
      setMarqueeText(savedMarqueeText);
    }

    if (savedScrollAmount) {
      setLocalScrollAmount(Number(savedScrollAmount));
      setScrollAmount(Number(savedScrollAmount));
    }
  }, [setMarqueeText, setScrollAmount]);

  const handleMarqueeTextChange = (e) => {
    setLocalMarqueeText(e.target.value);
  };

  const handleScrollAmountChange = (e) => {
    setLocalScrollAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMarqueeText(localMarqueeText);
    setScrollAmount(localScrollAmount);
    onSave(localMarqueeText, localScrollAmount);
    localStorage.setItem('marqueeText', localMarqueeText);
    localStorage.setItem('scrollAmount', localScrollAmount);
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
            value={localMarqueeText}
            onChange={handleMarqueeTextChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="scrollAmount">Kayma Hızı:</label>
          <input
            type="number"
            id="scrollAmount"
            value={localScrollAmount}
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
