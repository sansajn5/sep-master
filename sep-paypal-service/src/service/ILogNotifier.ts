export default interface ILogNotifer {
    fireLog(colerrationId: string, type: 'info' | 'error' , description: string): Promise<void>;
}