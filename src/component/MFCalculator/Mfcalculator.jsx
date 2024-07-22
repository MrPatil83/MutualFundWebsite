import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mfcalculator = () => {
  const [fundTypes, setFundTypes] = useState([]);
  const [fundType, setFundType] = useState('');
  const [schemeNames, setSchemeNames] = useState([]);
  const [schemeName, setSchemeName] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState(null);

  const API_URL = 'https://script.google.com/macros/s/AKfycbz0wn3vGEJeZvYaWmAHjfYuM-76kAHxJ2s858IFj1TGaYadBibZ-SwsVZH1Ck0g-PIn/exec';

  useEffect(() => {
    axios.get(`${API_URL}?action=getFundTypes`)
      .then(response => setFundTypes(response.data))
      .catch(error => console.error('Error fetching fund types:', error));
  }, [API_URL]);

  useEffect(() => {
    if (fundType) {
      axios.get(`${API_URL}?action=getSchemesByFundType&fundType=${fundType}`)
        .then(response => setSchemeNames(response.data))
        .catch(error => console.error('Error fetching schemes:', error));
    }
  }, [fundType, API_URL]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const totalInvestment = installmentAmount * months;

    const annualRate = 0.08;
    const monthlyRate = annualRate / 12;
    let futureValue = 0;
    for (let i = 0; i < months; i++) {
      futureValue += installmentAmount * Math.pow(1 + monthlyRate, months - i);
    }

    const profit = futureValue - totalInvestment;
    const profitPercentage = (profit / totalInvestment) * 100;

    setResult({
      totalInvestment,
      futureValue,
      profit,
      profitPercentage
    });
  };

  return (
    <div>
      <h1>Mutual Fund SIP Calculator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fund Type:</label>
          <select value={fundType} onChange={(e) => setFundType(e.target.value)}>
            <option value="">Select Fund Type</option>
            {fundTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Scheme Name:</label>
          <select value={schemeName} onChange={(e) => setSchemeName(e.target.value)}>
            <option value="">Select Scheme</option>
            {schemeNames.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Installment Amount:</label>
          <input type="number" value={installmentAmount} onChange={(e) => setInstallmentAmount(e.target.value)} />
        </div>
        <div>
          <label>Frequency:</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button type="submit">Calculate</button>
      </form>
      {result && (
        <div>
          <h2>Results</h2>
          <p>Total Investment: ₹{result.totalInvestment.toFixed(2)}</p>
          <p>Future Value: ₹{result.futureValue.toFixed(2)}</p>
          <p>Profit: ₹{result.profit.toFixed(2)}</p>
          <p>Profit Percentage: {result.profitPercentage.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default Mfcalculator;
