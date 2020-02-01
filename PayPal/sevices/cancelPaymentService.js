const transactionService = require('../sevices/transaction.service');

module.exports.cancelPayment = async (req,res) => {
    try {        
        let body = req.body;
        const paymentReference = body.paymentID;
        const transaction = await transactionService.getTransactionByPaymentreference(paymentReference);
        transaction.status = 'canceled';

        await transactionService.updateTransaction(transaction.id, transaction);

        res.status(200).json({});
    } catch (err) {
        res.status(500).json({error: err});
    }
}