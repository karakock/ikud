import React, { useState, useEffect } from 'react';
import '../styles/ManageAyarSettings.css'; // CSS dosyasını ithal ediyoruz

const ManageAyarSettings = ({ show18Ayar, setShow18Ayar, show14Ayar, setShow14Ayar }) => {
  const [localShow18Ayar, setLocalShow18Ayar] = useState(show18Ayar);
  const [localShow14Ayar, setLocalShow14Ayar] = useState(show14Ayar);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setLocalShow18Ayar(show18Ayar);
    setLocalShow14Ayar(show14Ayar);
  }, [show18Ayar, show14Ayar]);

  const handleSaveSettings = () => {
    setShow18Ayar(localShow18Ayar);
    setShow14Ayar(localShow14Ayar);
    localStorage.setItem('show18Ayar', localShow18Ayar);
    localStorage.setItem('show14Ayar', localShow14Ayar);
    setSaveMessage('Başarıyla kaydedildi!');
    setTimeout(() => setSaveMessage(''), 3000); // 3 saniye sonra mesajı temizle
  };

  return (
    <div className="manage-ayar-settings">
      <h2>Ayarları Yönet</h2>
      <div className="settings-option">
        <input
          type="checkbox"
          checked={localShow18Ayar}
          onChange={(e) => setLocalShow18Ayar(e.target.checked)}
        />
        <label>
          18 Ayar Satış Fiyatını Göster
        </label>
      </div>
      <div className="settings-option">
        <input
          type="checkbox"
          checked={localShow14Ayar}
          onChange={(e) => setLocalShow14Ayar(e.target.checked)}
        />
        <label>
          14 Ayar Satış Fiyatını Göster
        </label>
      </div>
      <button className="save-button" onClick={handleSaveSettings}>Kaydet</button>
      {saveMessage && <div className="save-message">{saveMessage}</div>}
    </div>
  );
};

export default ManageAyarSettings;
