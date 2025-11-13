import { Test, TestingModule } from '@nestjs/testing';
import { WarsawClientService } from './warsaw-client.service';

describe('WarsawClientService', () => {
  let service: WarsawClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarsawClientService],
    }).compile();

    service = module.get<WarsawClientService>(WarsawClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
