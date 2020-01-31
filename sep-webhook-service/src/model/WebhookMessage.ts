export interface WebhookMessage {
    referenceId: string;
    status: 'success' | 'failed';
    merchantId: string;
}