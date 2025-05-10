import { Injectable } from '@nestjs/common';
import { CreateKafkaNoSpecDto } from './dto/create-kafka--no-spec.dto';
import { UpdateKafkaNoSpecDto } from './dto/update-kafka--no-spec.dto';

@Injectable()
export class KafkaNoSpecService {
  create(createKafkaNoSpecDto: CreateKafkaNoSpecDto) {
    return 'This action adds a new kafkaNoSpec';
  }

  findAll() {
    return `This action returns all kafkaNoSpec`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kafkaNoSpec`;
  }

  update(id: number, updateKafkaNoSpecDto: UpdateKafkaNoSpecDto) {
    return `This action updates a #${id} kafkaNoSpec`;
  }

  remove(id: number) {
    return `This action removes a #${id} kafkaNoSpec`;
  }
}
