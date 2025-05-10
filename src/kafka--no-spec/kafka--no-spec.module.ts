import { Module } from '@nestjs/common';
import { KafkaNoSpecService } from './kafka--no-spec.service';
import { KafkaNoSpecController } from './kafka--no-spec.controller';

@Module({
  controllers: [KafkaNoSpecController],
  providers: [KafkaNoSpecService],
})
export class KafkaNoSpecModule {}
