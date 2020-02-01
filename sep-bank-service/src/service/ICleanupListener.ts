export default interface ICleanupListener {
    listenCleanup(): Promise<void>;
}