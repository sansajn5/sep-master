export default interface ILogNotifier {
    fireLog(colerrationId: string, type: 'info' | 'error' , description: string): Promise<void>;
}