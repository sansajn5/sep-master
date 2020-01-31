export default interface IClientNotifier {
    clientCreated(id: string, successUrl: string, failedUrl: string): Promise<void>
}