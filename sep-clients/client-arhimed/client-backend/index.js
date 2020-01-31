const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
// todo use merchent + secret
const merchantId = '17ec969e-b845-41f7-824a-2a1877406e78';
const secret = '6e6f8f05-2513-4487-9a3b-e07f9bae2b0a';

let payments = [];
let jwt = null;

const app = express();
const port = 8080;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: fs.readFileSync("./centrala_cert.pem"),
    key: fs.readFileSync("./centrala.pem"),
})
  

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Will change to actual Internal network IP
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});
app.use(bodyParser.json());

app.get('', (req, res, next) => {
    res.json({message: 'cao'});
})

const getToken = async () => {
    const response = await axios.post('https://localhost:8000/api/client/auth/login', {
        merchantId,
        password: secret
    }, {
        httpsAgent,
        headers: {"expecto-patronum" : `nemanja`}
    });
    jwt = response.data.token;
}

const getPayments = async () => {
    const response = await axios.get(`https://localhost:8000/api/client/clients/${merchantId}`, {
        headers: {"expecto-patronum" : `${jwt}`}, httpsAgent,
    });
    payments = response.data;
}

app.get('/get-token', async (req, res, next) => {
    await getToken();
    res.status(201);
});

app.get('/payments', async (req, res, next) => {
    if (jwt == null) {
        await getToken();
        await getPayments();
    }
    res.json({
        payments: payments
    });
});

app.listen(port, () => console.log(`App started successfully! Try it at http://localhost:${port}`));