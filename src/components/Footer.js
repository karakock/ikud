import React, { useState, useEffect } from 'react';
import '../styles/Footer.css';

const Footer = ({ symbols }) => {
  const [footerData, setFooterData] = useState({
    ons: 0,
    usd: 0,
    euro: 0,
    parite: 0,
    has: 0
  });

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket('wss://152.89.36.148:24876');

      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket data received:', data); // Debug log
          if (symbols && symbols.length > 0) {
            const filteredData = data.filter(item => symbols.includes(item.Code));
            const newFooterData = {};
            filteredData.forEach(item => {
              if (item.Code === 'ONS') newFooterData.ons = item.Bid;
              if (item.Code === 'USDTRY') newFooterData.usd = item.Bid;
              if (item.Code === 'EURTRY') newFooterData.euro = item.Bid;
              if (item.Code === 'EURUSD') newFooterData.parite = item.Bid;
              if (item.Code === 'HAS') newFooterData.has = item.Bid;
            });
            setFooterData(newFooterData);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbols]);

  return (
    <div className="footer-container">
      <div className="row">
        <div className="col-sm p3">ONS <span>{footerData.ons}</span></div>
        <div className="col-sm p3">USD <span>{footerData.usd}</span></div>
        <div className="col-sm p3">EURO <span>{footerData.euro}</span></div>
        <div className="col-sm p3">€/$ <span>{footerData.parite}</span></div>
        <div className="col-sm p3">HAS <span>{footerData.has}</span></div>
      </div>
      <div className="row footer d-flex align-items-center justify-content-center">
        <div className="col-sm p4 text-end footer-text" style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "15px" }}>Copyright © 2024 İKUD. All rights reserved.</div>
      </div>
    </div>
  );
};

export default Footer;
