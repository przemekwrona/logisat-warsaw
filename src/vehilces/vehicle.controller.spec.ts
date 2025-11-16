import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { UserService } from '../user/user.service';
import { VehicleService } from './vehicle.service';

describe('DelayController', () => {
  let controller: VehicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            // mock service methods here
            getLastPositions: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
