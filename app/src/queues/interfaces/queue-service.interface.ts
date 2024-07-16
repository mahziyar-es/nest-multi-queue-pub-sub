export interface QueueServiceInterface {
  publish: (message: string) => Promise<void>;
}
