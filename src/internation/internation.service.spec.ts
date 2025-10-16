import { Test, TestingModule } from '@nestjs/testing';
import { InternationService } from './internation.service';

describe('InternationService', () => {
  let service: InternationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InternationService],
    }).compile();

    service = module.get<InternationService>(InternationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
