import React, { useState, useEffect, useContext } from 'react';
import '../styles/PriceTable.css';
import Marquee from './Marquee';
import Carousel from './Carousel';
import { OperationsContext } from '../AdminPanel/context/OperationsContext';

const PriceTable = ({ marqueeText, scrollAmount, symbols, show18Ayar, show14Ayar }) => {
  const [prices, setPrices] = useState([]);
  const { operations } = useContext(OperationsContext);

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket('wss://ikud-git-aslan-nefes45s-projects.vercel.app');

      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const filteredData = data.filter(item => symbols.includes(item.Code));
          const updatedData = filteredData.map(item => ({
            ...item,
            Bid: applyOperation(parseFloat(item.Bid), operations[item.Code]?.Bid),
            Ask: applyOperation(parseFloat(item.Ask), operations[item.Code]?.Ask)
          }));
          setPrices(updatedData);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed, retrying...');
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
  }, [symbols, operations]);

  const applyOperation = (price, operation) => {
    if (!operation) return price;
    const match = operation.match(/([-+*/])(\d+(\.\d+)?)/);
    if (!match) return price;
    const operator = match[1];
    const value = parseFloat(match[2]);
    switch (operator) {
      case '+':
        return price + value;
      case '-':
        return price - value;
      case '*':
        return price * value;
      case '/':
        return price / value;
      default:
        return price;
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.round(number * 100) / 100);
  };

  const getPriceData = (code) => {
    const item = prices.find(item => item.Code === code);
    if (!item) return { Bid: 0, Ask: 0 };
    return {
      Bid: item.Bid,
      Ask: item.Ask,
    };
  };

  return
    <div className="table-container container-fluid">
      <div className="row header2 text-center d-flex align-items-center justify-content-between">
        <div className="col-sm">
          <div className="row border-bottom header2 text-center d-flex align-items-center justify-content-between">
            <div className="col-4 h">CANLI</div>
            <div className="col-4">SATIŞ</div>
            <div className="col-4">ALIŞ</div>
          </div>
          <div className="row border-bottom header2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-4 p3 h`}><span className="r">24</span> HAS</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('UHAS').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('UHAS').Ask)}</span></div>
          </div>
          <div className="row border-bottom header2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-4 p3 h`}><span className="r">22</span> AYAR</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('22AYAR').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('22AYAR').Ask)}</span></div>
          </div>
          {show18Ayar && (
            <div className="row border-bottom header2 text-center d-flex align-items-center justify_content_between">
              <div className={`col-4 p3 h`}><span className="r">18</span> AYAR</div>
              <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('18AYAR').Bid)}</span></div>
              <div className="col-4 p3"><span>{formatNumber(getPriceData('18AYAR').Ask)}</span></div>
            </div>
          )}
          {show14Ayar && (
            <div className="row border-bottom header2 text-center d-flex align-items-center justify_content_between">
              <div className={`col-4 p3 h`}><span className="r">14</span> AYAR</div>
              <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('14AYAR').Bid)}</span></div>
              <div className="col-4 p3"><span>{formatNumber(getPriceData('14AYAR').Ask)}</span></div>
            </div>
          )}
          <div className="border-bottom header3 text-center d-flex align-items-center justify-content-between">
            <div className="col-12">
              {marqueeText && <Marquee text={marqueeText} scrollAmount={scrollAmount} />}
            </div>
          </div>
        </div>
        <div className="col-sm p-0">
          <Carousel />
        </div>
      </div>
      <div className="row header2 text-center d-flex align-items-center justify-content-between">
        <div className="col-sm border-right">
          <div className="row border-bottom header2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>Y</div>
            <div className={`col-3 p3 h`}>ÇEYREK</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('YCEYREK').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('YCEYREK').Ask)}</span></div>
          </div>
          <div className="row border-bottom header2 text_center d-flex align-items-center justify_content_between">
            <div className={`col-1 p3 d`}>E</div>
            <div className={`col-3 p3 h`}>YARIM</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('YYARIM').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('YYARIM').Ask)}</span></div>
          </div>
          <div className="row border-bottom header2 text_center d-flex align-items-center justify_content_between">
            <div className={`col-1 p3 d`}>N</div>
            <div className={`col-3 p3 h`}>ZİYNET</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('YZIYNET').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('YZIYNET').Ask)}</span></div>
          </div>
          <div className="row border-bottom header2 text_center d-flex.align-items-center justify_content_between">
            <div className={`col-1 p3 d`}>İ</div>
            <div className={`col-3 p3 h`}>ATA</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('YATA').Bid)}</span></div>
            <div class="col-4 p3"><span>{formatNumber(getPriceData('YATA').Ask)}</span></div>
          </div>
          <div className="row border-bottom header4 text-center d-flex.align-items-center justify_content_between">
            <div className={`col-4 p3 h`}>USD</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('USDTRY').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('USDTRY').Ask)}</span></div>
          </div>
        </div>
        <div className="col-sm">
          <div className="row border-bottom header2 text_center d-flex.align-items-center justify_content_between">
            <div className={`col-1 p3 d`}>E</div>
            <div className={`col-3 p3 h`}>ÇEYREK</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('ECEYREK').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('ECEYREK').Ask)}</span></div>
          </div>
          <div className="row border-bottom header2 text_center d-flex.align-items_center justify_content_between">
            <div className={`col-1 p3 d`}>S</div>
            <div className={`col-3 p3 h`}>YARIM</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('EYARIM').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('EYARIM').Ask)}</span></div>
          </div>
          <div className="row border-bottom header2 text_center d-flex.align-items-center justify_content_between">
            <div className={`col-1 p3 d`}>K</div>
            <div className={`col-3 p3 h`}>ZİYNET</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('EZIYNET').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('EZIYNET').Ask)}</span></div>
          </div>
          <div className="row border-bottom header2 text_center d-flex.align-items-center justify_content_between">
            <div className={`col-1 p3 d`}>İ</div>
            <div className={`col-3 p3 h`}>ATA</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('EATA').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('EATA').Ask)}</span></div>
          </div>
          <div className="row border-bottom header4 text-center d-flex.align-items-center justify_content_between">
            <div className={`col-4 p3 h`}>EURO</div>
            <div className="col-4 p3 bg-light text-dark"><span>{formatNumber(getPriceData('EURTRY').Bid)}</span></div>
            <div className="col-4 p3"><span>{formatNumber(getPriceData('EURTRY').Ask)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTable;
