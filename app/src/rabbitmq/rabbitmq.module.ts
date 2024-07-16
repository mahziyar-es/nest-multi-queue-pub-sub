import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { rabbitMQClientProvider } from './rabbitmq-client.provider';

@Module({
  imports: [],
  providers: [rabbitMQClientProvider, RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
