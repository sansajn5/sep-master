let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const config = require('./config/config.json');

let app = express();

mongoose.connect('mongodb://localhost/crypto-service');

// DB
const mongoUri = `mongodb+srv://${config.mongoUsername}:${config.mongoPassword}@cscluster-f4fae.mongodb.net/pcc?retryWrites=true&w=majority`;
mongoose.connect(mongoUri,{
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

app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: false }));

// Set CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    next()
});

// API

const createBank = require('./api/POSTBank');
app.post('/api/create-bank', createBank.handler);

const createCard = require('./api/POSTCard');
app.post('/api/create-card', createCard.handler);

const paymentTransfer = require('./api/POSTPaymentTransfer');
app.post('/api/payment-transfer', paymentTransfer.handler);


app.listen(8020, function(){
});