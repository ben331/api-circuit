const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const axios = require('axios');
const circuitBreaker = require('opossum');

const circuitBreakerOptions = {
    errorThresholdPercentage: 50,
    resetTimeout: 5000,
    rollingCountTimeout: 10000,
    setTimeout: 3000,
    fallback: () => 'Service unavailable. Please try again later.'
};

const apiCall = () => axios.get('https://smartree-api.azurewebsites.net:443/api/dashboard');
const apiCall2 = () => axios.get('https://smartree-api.azurewebsites.net:443/api/slow-service?timeout=${timeout}');

const circuitBreakerInstance = new circuitBreaker(apiCall, circuitBreakerOptions);
const circuitBreakerSlow = new circuitBreaker(apiCall2, circuitBreakerOptions);

app.get('/api/src', async (req, res) => {
    try {
        const responseBody = await circuitBreakerInstance.fire();
        res.json(responseBody.data);
    } catch (error) {
        res.json(error.message);
    }    
});

app.get('/api/src', async (req, res) => {
    try {
        const responseBody = await circuitBreakerInstance.fire();
        res.json(responseBody.data);
    } catch (error) {
        res.json(error.message);
    }    
});

app.get('/api/slow-service', async (req, res) => {
    try {
        circuitBreakerSlow
        const responseBody = await circuitBreakerSlow.fire(req.query.timeout);
        res.json(responseBody.data);
    } catch (error) {
        res.json(error.message);
    }    
});

app.get('/api/circuit-breaker', (req, res) => {
    const status = circuitBreakerInstance.toJSON()
    res.json(status);
});
  

app.listen( port, () => {
  console.log(`Server running on port ${port}`);
});