import { PartialType } from '@nestjs/swagger';
import { CreateKafkaNoSpecDto } from './create-kafka--no-spec.dto';

export class UpdateKafkaNoSpecDto extends PartialType(CreateKafkaNoSpecDto) {}
