const express = require('express');
const axios = require('axios');
const router = express.Router();
const app = express();
const port = 3000; 
const tingoApiKey = '1d503bef913af4a4bd75c16cfdc1121182b3c5fd';
const newsApiKey = process.env.NEWS_API_KEY;



/* Search for company names api for autocomplete */
app.get('/search/:ticker', async function (req, res, next) {
    try {
        const ticker = req.params.ticker;
        const response = await axios.get(`https://api.tiingo.com/tiingo/utilities/search?query=${ticker}&token=${tingoApiKey}`);
        const data = response.data;
        const processedData = await processData(data);
        res.send(processedData);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});

/* Get the details for the company */
app.get('/detail/:ticker', async function (req, res, next) {
    try {
        const ticker = req.params.ticker;
        const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}?token=${tingoApiKey}`);
        const data = response.data;
        const details = {
            results: data ? [data] : [],
            success: !!data,
        };
        res.send(details);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});

/* Get the company price data  */
app.get('/price/:ticker', async function (req, res, next) {
    try {
        const ticker = req.params.ticker;
        const response = await axios.get(`https://api.tiingo.com/iex/?tickers=${ticker}&token=${tingoApiKey}`);
        const data = response.data;
        const price = {
            results: data || [],
            success: !!data,
        };
        res.send(price);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});

/* Get the daily chart data */
app.get('/chart/daily/:ticker/:startDate', async function (req, res, next) {
    try {
        const ticker = req.params.ticker;
        const startDate = req.params.startDate;
        const response = await axios.get(`https://api.tiingo.com/iex/${ticker}/prices?startDate=${startDate}&resampleFreq=4min&token=${tingoApiKey}`);
        const data = response.data;
        const dailyChart = {
            results: data || [],
            success: !!data,
        };
        res.send(dailyChart);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});

/* Get the company news data  */
app.get('/news/:ticker', async function (req, res, next) {
    try {
        const ticker = req.params.ticker;
        const response = await axios.get(`https://newsapi.org/v2/everything?apiKey=${newsApiKey}&q=${ticker}`);
        const data = response.data;
        const news = {
            results: data ? processNews(data.articles) : [],
            success: !!data,
        };
        res.send(news);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});

/* Get the daily chart data */
app.get('/chart/historical/:ticker', async function (req, res, next) {
    try {
        const dateTwoYears = new Date();
        dateTwoYears.setFullYear(dateTwoYears.getFullYear() - 2);
        const startDate = getDateStr(dateTwoYears);
        console.log(startDate);

        const ticker = req.params.ticker;
        const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?startDate=${startDate}&resampleFreq=daily&token=${tingoApiKey}`);
        const data = response.data;
        const histChart = {
            results: data || [],
            success: !!data,
        };
        res.send(histChart);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});

function processHistChart(data) {
    const results = {
        volume: [],
        ohlc: []
    };

    for (var i = 0; i < data.length; i++) {
        results.volume.push([
            new Date(data[i].date).getTime(),
            data[i].volume
        ]);

        results.ohlc.push([
            new Date(data[i].date).getTime(),
            data[i].open,
            data[i].high,
            data[i].low,
            data[i].close
        ]);
    }

    return results;
}


function processNews(data) {

  results = [];

  for (var i = 0; i < data.length; i++){
    if (data[i].url && data[i].title && data[i].description && data[i].source.name 
      && data[i].urlToImage && data[i].publishedAt) {
        results.push({
          url: data[i].url,
          title: data[i].title,
          description: data[i].description,
          source: data[i].source.name,
          urlToImage: data[i].urlToImage,
          publishedAt: data[i].publishedAt
      });

    }
  }

  return results;

}


function processData(data) {

  var result = {
    results: [],
    total: 0
  };

  for (var i = 0; i < data.length; i++){
    // console.log()
    if (data[i].name) {
      result.results.push({
        name: data[i].name,
        ticker: data[i].ticker
      })
    }
  }

  result.total = result.results.length;

  return result;

}

function getDateStr(date) {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  let year = date.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');

}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


