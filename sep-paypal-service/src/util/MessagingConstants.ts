const MessagingConstants = {
  LogExchangeName: 'log',
  LogCreatedRoutingKey: 'log.created',
  WebbookExchangeName: 'webhook',
  WebhookNotifyRoutingKey: 'webhook.notify',
  CleanupExchangeName: 'cleanup',
  CleanUpRoutingKey: 'cleanup.start',
  CleanupStartQueueName: 'bank-cleanup-start'
};

export default MessagingConstants;
