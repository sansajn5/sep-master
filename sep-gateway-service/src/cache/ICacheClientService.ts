export default interface ICacheClientService {

  getValue(key: string): Promise<string>;

  setValue(key: string, value: string, expiresIn: number): Promise<string>;
}
