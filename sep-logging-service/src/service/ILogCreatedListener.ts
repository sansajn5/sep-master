export default interface ILogCreatedListener {
    listen(): Promise<void>;
}