const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const axios = require('axios');
const circuitBreaker = require('opossum');

const circuitBreakerOptions = {
    errorThresholdPercentage: 50,
    resetTimeout: 5000,
    rollingCountTimeout: 10000,
    fallback: () => 'Service unavailable. Please try again later.'
};

const apiCall = () => axios.get('https://smartree-api.azurewebsites.net:443/api/dashboard');

const circuitBreakerInstance = new circuitBreaker(apiCall, circuitBreakerOptions);

app.get('/api/src', async (req, res) => {
    try {
        const responseBody = await circuitBreakerInstance.fire();
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