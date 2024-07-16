import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { SQSModule } from 'src/sqs/sqs.module';
import { QueuesController } from './queues.controller';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { QueueFactory } from './queue.factory';

@Module({
  imports: [SQSModule, RabbitMQModule],
  controllers: [QueuesController],
  providers: [QueueFactory, QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
