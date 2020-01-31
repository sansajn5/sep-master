const MessagingConstants = {
  ClientExchangeName: 'client',
  ClientCreatedRoutingKey: 'client.created',
  ClientCreatedQueueName: 'webhook-client.created',
  WebbookExchangeName: 'webhook',
  WebhookNotifyQueueName: 'webhook-webhook.notify',
  WebhookNotifyRoutingKey: 'webhook.notify'
};

export default MessagingConstants;
