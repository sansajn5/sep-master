let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const config = require('./config/config.json');

let app1 = express();

mongoose.connect('mongodb://localhost/crypto-service');

// DB
const mongoUri1 = `mongodb+srv://${config.mongoUsername}:${config.mongoPassword}@cscluster-f4fae.mongodb.net/bank1?retryWrites=true&w=majority`;
mongoose.connect(mongoUri1,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => {
    console.log('Connected to database! - 1');
})
.catch(() => {
    console.log('Connection failed!');
})

app1.use(bodyParser.json({type: 'application/json'}));
app1.use(bodyParser.urlencoded({ extended: false }));

// Set CORS
app1.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    next()
});

// API
const createAccount = require('./api/POSTAccount');
app1.post('/api/create-account', createAccount.handler);

const createClient = require('./api/POSTClient');
app1.post('/api/create-client', createClient.handler);

const createPaymentRequest = require('./api/POSTPaymentRequest');
app1.post('/api/create-payment-request', createPaymentRequest.handler);

const paymentExecute = require('./api/POSTPaymentExecute');
app1.post('/api/payment-execute', paymentExecute.handler);

const acquirerRequest = require('./api/POSTAcquirerRequest');
app1.post('/api/acquirer-request', acquirerRequest.handler);

const issuerResponse = require('./api/POSTAIssuerResponse');
app1.post('/api/issuer-response', issuerResponse.handler);

app1.listen(8010, function(){
});



