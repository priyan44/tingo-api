const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; 

// Endpoint to check Connection

app.get('/checkConnection', async (req, res) => {
  const thirdPartyApiUrl = 'https://api.tiingo.com/api/test';
  const token = '1d503bef913af4a4bd75c16cfdc1121182b3c5fd';

  try {
    const response = await axios.get(thirdPartyApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get company details/summary
app.get('/api/detail/:ticker', async (req, res) => {
    try {
      const { ticker } = req.params;
      const response = await axios.get(`https://api.example.com/detail/${ticker}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get prices for multiple companies
  app.get('/api/price/:tickers', async (req, res) => {
    try {
      const { tickers } = req.params;
      const response = await axios.get(`https://api.example.com/price/${tickers}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get daily chart data
  app.get('/api/chart/daily/:ticker/:startDate', async (req, res) => {
    try {
      const { ticker, startDate } = req.params;
      const response = await axios.get(`https://api.example.com/chart/daily/${ticker}/${startDate}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get historical chart data
  app.get('/api/chart/historical/:ticker', async (req, res) => {
    try {
      const { ticker } = req.params;
      const response = await axios.get(`https://api.example.com/chart/historical/${ticker}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get news articles
  app.get('/api/news/:searchQuery', async (req, res) => {
    try {
      const { searchQuery } = req.params;
      const response = await axios.get(`https://api.example.com/news/${searchQuery}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint for search query
  app.get('/api/search/:searchQuery', async (req, res) => {
    try {
      const { searchQuery } = req.params;
      const response = await axios.get(`https://api.example.com/search/${searchQuery}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  
