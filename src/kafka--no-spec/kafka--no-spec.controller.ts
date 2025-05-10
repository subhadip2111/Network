import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KafkaNoSpecService } from './kafka--no-spec.service';
import { CreateKafkaNoSpecDto } from './dto/create-kafka--no-spec.dto';
import { UpdateKafkaNoSpecDto } from './dto/update-kafka--no-spec.dto';

@Controller('kafka--no-spec')
export class KafkaNoSpecController {
  constructor(private readonly kafkaNoSpecService: KafkaNoSpecService) {}

  @Post()
  create(@Body() createKafkaNoSpecDto: CreateKafkaNoSpecDto) {
    return this.kafkaNoSpecService.create(createKafkaNoSpecDto);
  }

  @Get()
  findAll() {
    return this.kafkaNoSpecService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kafkaNoSpecService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKafkaNoSpecDto: UpdateKafkaNoSpecDto) {
    return this.kafkaNoSpecService.update(+id, updateKafkaNoSpecDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kafkaNoSpecService.remove(+id);
  }
}
