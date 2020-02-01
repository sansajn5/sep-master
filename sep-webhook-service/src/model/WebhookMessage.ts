export interface WebhookMessage {
    referenceId: string;
    status: 'success' | 'failed' | 'cancel';
    vendorId: string;
}