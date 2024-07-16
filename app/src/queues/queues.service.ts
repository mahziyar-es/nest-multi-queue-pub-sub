import { Injectable } from '@nestjs/common';
import { QueueServiceInterface } from './interfaces/queue-service.interface';
import { PublishMessageDto } from './dto/publish-message.dto';
import { QueueFactory } from './queue.factory';
import { QueueType } from './types/queue.type';

@Injectable()
export class QueuesService {
  private queueServices: QueueServiceInterface[] = [];

  constructor(private readonly queueFactory: QueueFactory) {
    const queueTypes = process.env.QUEUES?.split(',');

    for (const queueType of queueTypes as QueueType[]) {
      const queueService = this.queueFactory.create(queueType);
      queueService.subscribe();
      this.queueServices.push(queueService);
    }
  }

  async publish(publishMessageDto: PublishMessageDto) {
    const message = JSON.stringify(publishMessageDto.body);

    const publishPromises = this.queueServices.map((queueService) =>
      queueService.publish(message),
    );

    await Promise.all(publishPromises);
  }
}
