const transactionService = require('./transaction.service');

const cleanTransactions = async () => {
    console.log('set status after 5 minutes')

    const transactions = await transactionService.finAllTransactionsForClean();

    for(let transaction of transactions) {
        transaction.status = 'canceled';
        await transactionService.updateTransaction(transaction.id, transaction);
    }
}

module.exports = {
    cleanTransactions
}