import { FactoryProvider } from '@nestjs/common';
import amqp from 'amqp-connection-manager';
import { Channel } from 'amqplib';

export const rabbitMQClientProvider: FactoryProvider = {
  provide: 'RabbitMQClient',
  useFactory: () => {
    const connection = amqp.connect([process.env.RABBITMQ_URL]);
    return connection.createChannel({
      setup: async (channel: Channel) => {
        return channel.assertQueue(process.env.RABBITMQ_QUEUE_NAME, {
          durable: false,
        });
      },
    });
  },
};
