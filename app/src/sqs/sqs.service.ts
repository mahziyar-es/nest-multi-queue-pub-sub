import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { QueueServiceInterface } from 'src/queues/interfaces/queue-service.interface';

@Injectable()
export class SQSService implements QueueServiceInterface {
  constructor(private readonly sqsClient: SQSClient) {}

  async publish(message: string) {
    try {
      const command = new SendMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: message,
      });

      await this.sqsClient.send(command);

      Logger.log('sent to SQS queue');
    } catch (error: unknown) {
      Logger.log('error sending to SQS:', JSON.stringify(error));

      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
