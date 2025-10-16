import { Test, TestingModule } from '@nestjs/testing';
import { InternationController } from './internation.controller';
import { InternationService } from './internation.service';

describe('InternationController', () => {
  let controller: InternationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternationController],
      providers: [InternationService],
    }).compile();

    controller = module.get<InternationController>(InternationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
