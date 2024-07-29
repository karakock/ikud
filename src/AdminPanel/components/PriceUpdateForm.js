import React, { useState, useContext, useEffect } from 'react';
import '../styles/PriceUpdateForm.css';
import { OperationsContext } from '../context/OperationsContext'; // Import OperationsContext

const PriceUpdateForm = () => {
  const { operations: contextOperations, updateOperations, resetOperations } = useContext(OperationsContext); // Use context
  const [operations, setOperations] = useState({});

  useEffect(() => {
    setOperations(contextOperations);
  }, [contextOperations]);

  const handleOperationChange = (e, key, type) => {
    const value = e.target.value;
    setOperations(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOperations(operations);
  };

  const handleReset = () => {
    setOperations({});
    resetOperations();
  };

  const formFields = [
    { label: '24 Ayar Has Altın', key: 'UHAS' },
    { label: '22 Ayar Has Altın', key: '22AYAR' },
    { label: '18 Ayar Has Altın', key: '18AYAR' },
    { label: '14 Ayar Has Altın', key: '14AYAR' },
    { label: 'Çeyrek', key: 'YCEYREK' },
    { label: 'Yarım', key: 'YYARIM' },
    { label: 'Ziynet', key: 'YZIYNET' },
    { label: 'Ata', key: 'YATA' },
    { label: 'Dolar', key: 'USDTRY' },
    { label: 'Euro', key: 'EURTRY' },
  ];

  return (
    <form onSubmit={handleSubmit} className="price-update-form-container">
      <h2>Fiyat Güncelleme Formu</h2>
      {formFields.map(field => (
        <div className="form-group" key={field.key}>
          <label htmlFor={`${field.key}_Bid`}>{field.label} Alış:</label>
          <input
            type="text"
            id={`${field.key}_Bid`}
            placeholder="Operation (+, -, *, /)"
            value={operations[field.key]?.Bid || ''}
            onChange={(e) => handleOperationChange(e, field.key, 'Bid')}
          />
          <label htmlFor={`${field.key}_Ask`}>{field.label} Satış:</label>
          <input
            type="text"
            id={`${field.key}_Ask`}
            placeholder="Operation (+, -, *, /)"
            value={operations[field.key]?.Ask || ''}
            onChange={(e) => handleOperationChange(e, field.key, 'Ask')}
          />
        </div>
      ))}
      <div className="form-buttons">
        <button type="submit" className="btn btn-update">Update Prices</button>
        <button type="button" className="btn btn-reset" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
};

export default PriceUpdateForm;
