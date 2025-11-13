import { Test, TestingModule } from '@nestjs/testing';
import { WarsawStreamPositionsService } from './warsaw-stream-positions.service';

describe('WarsawStreamPositionsService', () => {
  let service: WarsawStreamPositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarsawStreamPositionsService],
    }).compile();

    service = module.get<WarsawStreamPositionsService>(WarsawStreamPositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
