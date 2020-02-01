const Transaction = require('../models/transactions');

const createTransaction = async (body) => {

    const transaction = new Transaction({
        createdAt: (new Date()).toISOString(),
        merchantId: body.merchantId,
        referenceId: body.referenceId,
        productId: body.productId,
        amount: body.amount,dejan
    });
    const result = transaction.save();

    return result;
}

const getTransactionByid = async (transactiondId) => {
    return await Transaction.findOne({_id: transactiondId});
}


module.exports = {
    createTransaction,
    getTransactionByid
}