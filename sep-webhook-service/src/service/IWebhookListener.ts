export default interface IWebhookListener {
    listenWebhooks(): Promise<any>
}