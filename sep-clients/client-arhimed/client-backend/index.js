const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const request = require('request');


const mongoose = require('mongoose');
const config = require('./config.json'); 
const Transaction = require('./Transaction');

// todo use merchent + secret
const merchantId = '17ec969e-b845-41f7-824a-2a1877406e78';
const secret = '6e6f8f05-2513-4487-9a3b-e07f9bae2b0a';

let payments = [];
let jwt = null;

const app = express();
const port = 8080;

mongoose.connect(`mongodb+srv://${config.mongoUser}:${config.mongoPw}@cluster0-yshbv.mongodb.net/scientific-center?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => {
    console.log('Connected to database!');
})
.catch(() => {
    console.log('Connection failed!');
})

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

app.post('/transaction', async (req, res, next) => {
    const body = req.body;

    const transaction = new Transaction({
        productId: body.productId,
        price: body.price,
        currency: 'USD',
        status: 'created',
        date: new Date().toISOString()
    });
    const response = await transaction.save();
    console.log(response);

    res.json(response);
})

app.post('/success', async (req, res, next) => {
    const body = req.body;
    console.log(body.referenceId)

    const transaction = await Transaction.findById(body.referenceId);
    console.log(transaction)
    transaction.status = 'success';

    Transaction.findById(transaction._id, (err, result) => {
        if (err) {
            return err;
        } else {
            Object.assign(result, transaction);
            result.save((err, res) => {
                if (err) {
                    return err;
                } else {
                    return result;
                }
            });
        }
    })

    res.json({});
})

app.post('/failed', async (req, res, next) => {
    const body = req.body;
    console.log(body.referenceId)
    
    const transaction = await Transaction.findById(body.referenceId);
    console.log(transaction)
    transaction.status = 'failed';

    Transaction.findById(transaction._id, (err, result) => {
        if (err) {
            return err;
        } else {
            Object.assign(result, transaction);
            result.save((err, res) => {
                if (err) {
                    return err;
                } else {
                    return result;
                }
            });
        }
    })

    res.json({});
})


app.post('/get-bank-url', async (req, res, next) => {
    const body = req.body;
    console.log(body.url)
    if (jwt == null) {
        await getToken();
    }
    const {data: {redirectUrl}} = await axios.post(body.url, body, {
        httpsAgent,
        headers: {"expecto-patronum" : jwt}
    });
    res.status(200).json({redirectUrl})

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
    res.json({payments});
});

app.listen(port, () => console.log(`App started successfully! Try it at http://localhost:${port}`));