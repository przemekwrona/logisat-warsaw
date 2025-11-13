import { Test, TestingModule } from '@nestjs/testing';
import { DelayController } from './delay.controller';

describe('DelayController', () => {
  let controller: DelayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelayController],
    }).compile();

    controller = module.get<DelayController>(DelayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
