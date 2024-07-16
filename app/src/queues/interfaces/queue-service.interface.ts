export interface QueueServiceInterface {
  publish: (message: string) => Promise<void>;
  subscribe: () => Promise<void>;
}
