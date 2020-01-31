const Transaction = require('../models/Transaction');

const createTransaction = async (item) => {
    const transaction = new Transaction({...item});
    return transaction.save();
}

const getTransactionByPaymentreference = async (paymentReference) => {
    return await Transaction.findOne({paymentReference: paymentReference});
}

const updateTransaction = async(transactionId, data) => {
    Transaction.findById(transactionId, (err, result) => {
        if (err) {
            return err;
        } else {
            Object.assign(result, data);
            result.save((err, res) => {
                if (err) {
                    return err;
                } else {
                    return result;
                }
            });
        }
    })
}

const finAllTransactionsForClean = async () => {
    const date = new Date().getTime() - 300000;
    console.log(new Date(date).toISOString());
    return await Transaction.find({
        status: 'created',
        date: {"$lt": new Date(date).toISOString()}
    })
}

module.exports = {
    createTransaction,
    getTransactionByPaymentreference,
    updateTransaction,
    finAllTransactionsForClean
}