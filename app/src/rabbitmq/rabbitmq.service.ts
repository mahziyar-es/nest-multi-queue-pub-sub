import { QueueServiceInterface } from 'src/queues/interfaces/queue-service.interface';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import amqp from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class RabbitMQService implements QueueServiceInterface, OnModuleInit {
  private queueName = process.env.RABBITMQ_QUEUE_NAME;
  private publisherChannel: ChannelWrapper;
  private subscriberChannel: ChannelWrapper;

  onModuleInit() {
    const connection = amqp.connect([process.env.RABBITMQ_URL]);

    this.subscriberChannel = connection.createChannel({
      setup: async (channel: Channel) => {
        return channel.assertQueue(this.queueName, {
          durable: false,
        });
      },
    });

    this.publisherChannel = connection.createChannel({
      setup: async (channel: Channel) => {
        return channel.assertQueue(this.queueName, {
          durable: false,
        });
      },
    });
  }

  async publish(message: string) {
    try {
      await this.publisherChannel.sendToQueue(
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
    await this.subscriberChannel.consume(
      this.queueName,
      (message) => {
        if (message) {
          Logger.log(`received message from RabbitMQ: ${message.content}`);
        }
      },
      {
        noAck: true,
      },
    );
  }
}
