import { Test, TestingModule } from '@nestjs/testing';
import { ClinicVetService } from './clinic-vet.service';

describe('ClinicVetService', () => {
  let service: ClinicVetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicVetService],
    }).compile();

    service = module.get<ClinicVetService>(ClinicVetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
