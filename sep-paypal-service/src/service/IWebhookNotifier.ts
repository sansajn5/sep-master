export default interface IWebhookNotifier {
    notifyMerchant(vendorId: string, status: 'success' | 'failed' | 'cancel', referenceId: string): Promise<void>

    notifyMerchantSub(vendorId: string, status: 'success' | 'failed' | 'cancel', referenceId: string, subscription: boolean): Promise<void>
}