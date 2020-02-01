let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const config = require('./config/config.json');


let app2 = express();

mongoose.connect('mongodb://localhost/crypto-service');

// DB
const mongoUri2 = `mongodb+srv://${config.mongoUsername}:${config.mongoPassword}@cscluster-f4fae.mongodb.net/bank2?retryWrites=true&w=majority`;
mongoose.connect(mongoUri2,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => {
    console.log('Connected to database! - 2');
})
.catch(() => {
    console.log('Connection failed!');
})

app2.use(bodyParser.json({type: 'application/json'}));
app2.use(bodyParser.urlencoded({ extended: false }));

// Set CORS
app2.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    next()
});

// API
const createAccount2 = require('./api/POSTAccount');
app2.post('/api/create-account', createAccount2.handler);

const createClient2 = require('./api/POSTClient');
app2.post('/api/create-client', createClient2.handler);

const createPaymentRequest2 = require('./api/POSTPaymentRequest');
app2.post('/api/create-payment-request', createPaymentRequest2.handler);

const paymentExecute2 = require('./api/POSTPaymentExecute');
app2.post('/api/payment-execute', paymentExecute2.handler);

const acquirerRequest = require('./api/POSTAcquirerRequest');
app2.post('/api/acquirer-request', acquirerRequest.handler);

const issuerResponse = require('./api/POSTAIssuerResponse');
app2.post('/api/issuer-response', issuerResponse.handler);

app2.listen(8011, function(){
});