import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { SQSService } from 'src/sqs/sqs.service';
import { QueueType } from './types/queue.type';

@Injectable()
export class QueueFactory {
  constructor(
    private readonly sqsService: SQSService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  create(type: QueueType) {
    switch (type) {
      case 'sqs':
        return this.sqsService;
      case 'rabbitmq':
        return this.rabbitMQService;
      default:
        throw new Error(
          'queue name(s) specified in environment variables are not correct',
        );
    }
  }
}
