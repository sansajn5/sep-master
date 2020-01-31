export default interface ILogger {
  info(message: string): void;

  error(err: Error): void;
}
