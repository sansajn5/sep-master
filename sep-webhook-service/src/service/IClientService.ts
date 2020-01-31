export default interface IClientService {

    create(id: string, successUrl: string, failedUrl: string): Promise<void>

}