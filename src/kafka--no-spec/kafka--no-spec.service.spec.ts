import { Test, TestingModule } from '@nestjs/testing';
import { KafkaNoSpecService } from './kafka--no-spec.service';

describe('KafkaNoSpecService', () => {
  let service: KafkaNoSpecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaNoSpecService],
    }).compile();

    service = module.get<KafkaNoSpecService>(KafkaNoSpecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
