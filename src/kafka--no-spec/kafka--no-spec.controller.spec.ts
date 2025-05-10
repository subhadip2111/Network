import { Test, TestingModule } from '@nestjs/testing';
import { KafkaNoSpecController } from './kafka--no-spec.controller';
import { KafkaNoSpecService } from './kafka--no-spec.service';

describe('KafkaNoSpecController', () => {
  let controller: KafkaNoSpecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KafkaNoSpecController],
      providers: [KafkaNoSpecService],
    }).compile();

    controller = module.get<KafkaNoSpecController>(KafkaNoSpecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
