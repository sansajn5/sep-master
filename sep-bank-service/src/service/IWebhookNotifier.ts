export default interface IWebhookNotifier {
    notifyMerchant(merchantId: string, status: 'success' | 'failed', referenceId: string): Promise<void>
}