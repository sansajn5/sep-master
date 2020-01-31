export default interface IClientCreatedListner {
    listen(): Promise<void>;
}