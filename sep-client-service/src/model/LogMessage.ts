export interface LogMessage {
    correlationId: string;
    logType: 'info' | 'error';
    timestamp: string;
    serviceName: string;
    description: string;
}