import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { QueueServiceInterface } from 'src/queues/interfaces/queue-service.interface';

@Injectable()
export class SQSService implements QueueServiceInterface {
  private queueURL = process.env.SQS_QUEUE_URL;

  constructor(private readonly sqsClient: SQSClient) {}

  async publish(message: string) {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueURL,
        MessageBody: message,
      });

      await this.sqsClient.send(command);

      Logger.log('sent to SQS queue');
    } catch (error: unknown) {
      Logger.log('error sending to SQS:', JSON.stringify(error));

      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async subscribe() {
    while (true) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueURL,
          MaxNumberOfMessages: 1,
        });

        const response = await this.sqsClient.send(command);

        if (response.Messages) {
          const message = response.Messages[0];
          Logger.log(`received message from SQS: ${message.Body}`);
          this.deleteMessage(message.ReceiptHandle);
        }
      } catch (error) {
        Logger.log('Error polling messages from SQS', error);
      }
    }
  }

  async deleteMessage(ReceiptHandle: string) {
    const command = new DeleteMessageCommand({
      QueueUrl: this.queueURL,
      ReceiptHandle,
    });

    await this.sqsClient.send(command);
  }
}
