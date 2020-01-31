export default interface IAuthService {
    login(merchantId: string, password: string): Promise<any>;
}