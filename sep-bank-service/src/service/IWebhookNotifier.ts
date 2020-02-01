export default interface IWebhookNotifier {
    notifyMerchant(vendorId: string, status: 'success' | 'failed' | 'cancel', referenceId: string): Promise<void>
}