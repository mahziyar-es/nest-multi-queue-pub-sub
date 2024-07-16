import { IsNotEmptyObject } from 'class-validator';

export class PublishMessageDto {
  @IsNotEmptyObject()
  body: Record<string, any>;
}
