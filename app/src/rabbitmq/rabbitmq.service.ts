import { QueueServiceInterface } from 'src/queues/interfaces/queue-service.interface';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements QueueServiceInterface {
  private queueName = process.env.RABBITMQ_QUEUE_NAME;
  constructor(
    @Inject('RabbitMQClient') private readonly rabbitMQClient: ChannelWrapper,
  ) {}

  async publish(message: string) {
    try {
      await this.rabbitMQClient.sendToQueue(
        this.queueName,
        Buffer.from(message),
      );

      Logger.log('sent to RabbitMQ queue');
    } catch (error) {
      Logger.log('error sending to RabbitMQ:', JSON.stringify(error));

      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async subscribe() {
    this.rabbitMQClient.consume(this.queueName, (message) => {
      if (message) {
        Logger.log(`received message from RabbitMQ: ${message.content}`);
      }
    });
  }
}
