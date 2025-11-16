import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { WarsawClientService } from '../client/warsaw-client/warsaw-client.service';
import { WarsawStreamPositionsService } from '../client/warsaw-client/warsaw-stream-positions.service';
import { calculateVelocity } from './geo-utils';
import { VehicleVelocityResponse } from '../generated/logisat-api';
import { first, size } from 'lodash';

jest.mock('./geo-utils', () => ({
  calculateVelocity: jest.fn(),
}));

describe('VehicleService', () => {
  let service: VehicleService;
  let warsawClientService: jest.Mocked<WarsawClientService>;
  let warsawStreamPositionsService: jest.Mocked<WarsawStreamPositionsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: WarsawClientService,
          useValue: {
            getAllPositions: jest.fn(),
          },
        },
        {
          provide: WarsawStreamPositionsService,
          useValue: {
            getStreamOfPositions: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    warsawClientService = module.get(WarsawClientService);
    warsawStreamPositionsService = module.get(WarsawStreamPositionsService);
  });

  it('should return last positions', async () => {
    const mockResponse = { vehicles: [] } as any;

    warsawClientService.getAllPositions.mockResolvedValue(mockResponse);

    const result = await service.getLastPositions();

    expect(warsawClientService.getAllPositions).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should build vehicle velocity list', async () => {
    warsawStreamPositionsService.getStreamOfPositions.mockResolvedValue({
      vehicles: [
        {
          positions: [
            {
              VehicleNumber: '123',
              Lines: '10',
              Lat: 52.1,
              Lon: 21.0,
            },
            {
              VehicleNumber: '123',
              Lines: '10',
              Lat: 52.099,
              Lon: 21.0,
            },
          ],
        },
      ],
    } as any);

    (calculateVelocity as jest.Mock).mockReturnValue(5.5);

    const result: VehicleVelocityResponse = await service.getVelocity();

    expect(size(result.vehicles)).toBe(1);
    expect(first(result.vehicles)).toEqual({
      vehicleNumber: '123',
      line: '10',
      velocity: 5.5,
    });
  });

  it('should return velocity only for the requested vehicleId', async () => {
    warsawStreamPositionsService.getStreamOfPositions.mockResolvedValue({
      vehicles: [
        {
          positions: [
            {
              VehicleNumber: '200',
              Lines: 'N12',
              Lat: 52.1,
              Lon: 21.0,
            },
            {
              VehicleNumber: '200',
              Lines: 'N12',
              Lat: 52.099,
              Lon: 21.0,
            },
          ],
        },
        {
          positions: [
            {
              VehicleNumber: '300',
              Lines: '20',
              Lat: 52.2,
              Lon: 21.1,
            },
            {
              VehicleNumber: '300',
              Lines: '20',
              Lat: 52.199,
              Lon: 21.1,
            },
          ],
        },
      ],
    } as any);

    (calculateVelocity as jest.Mock).mockReturnValue(7.3);

    const result: VehicleVelocityResponse = await service.getVelocityByVehicle('200');

    expect(size(result.vehicles)).toBe(1);
    expect(first(result.vehicles)).toEqual({
      vehicleNumber: '200',
      line: 'N12',
      velocity: 7.3,
    });
  });
});
