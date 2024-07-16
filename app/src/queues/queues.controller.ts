import { Body, Controller, Post } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { PublishMessageDto } from './dto/publish-message.dto';

@Controller('/queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post()
  async publish(@Body() publishMessageDto: PublishMessageDto) {
    await this.queuesService.publish(publishMessageDto);
  }
}
