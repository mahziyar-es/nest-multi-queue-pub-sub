import { SQSClient } from '@aws-sdk/client-sqs';
import { FactoryProvider } from '@nestjs/common';

export const sqsClientProvider: FactoryProvider = {
  provide: SQSClient,
  useFactory: () => {
    return new SQSClient({
      endpoint: 'http://localstack:4566',
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  },
};
