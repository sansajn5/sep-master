const exprees = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.json'); 

const app = exprees();
const defaultPort = 8082;

const createPaymentService = require('./sevices/createPaymentService');
const executePaymentService = require('./sevices/executePaymentService');
const cancelPaymentService = require('./sevices/cancelPaymentService');
const userService = require('./sevices/user.service');
const subscriptionService = require('./sevices/subscriptionService');
const executeAgreementService = require('./sevices/executeAgreementService');

mongoose.connect(`mongodb+srv://${config.mongoUser}:${config.mongoPw}@cluster0-yshbv.mongodb.net/paypal?retryWrites=true&w=majority`,{
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

app.post('/api/create-payment', createPaymentService.createPayment);
app.post('/api/execute-payment', executePaymentService.executePayment);
app.post('/api/cancel-payment', cancelPaymentService.cancelPayment);
app.post('/api/register', userService.createUser);
app.post('/api/subscribe', subscriptionService.subscribe);
app.get('/api/execute-agreement/:token/:merchantId/:userId', executeAgreementService.executeAgreement);

app.listen(process.env.PORT || defaultPort, () => console.log(`App listening on port ${process.env.PORT || defaultPort}`));