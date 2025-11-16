import { Test, TestingModule } from '@nestjs/testing';
import { WarsawStreamPositionsService, CachedVehicles } from './warsaw-stream-positions.service';
import { WarsawClientService } from './warsaw-client.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import moment from 'moment/moment';
import { WarsawVehiclePositionResponse, WarsawVehiclePosition } from '../../generated/public-transport-api';

describe('WarsawStreamPositionsService', () => {
  let service: WarsawStreamPositionsService;
  let cache: Cache;
  let warsawClient: WarsawClientService;

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockWarsawClient = {
    getAllPositions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarsawStreamPositionsService,
        { provide: CACHE_MANAGER, useValue: mockCache },
        { provide: WarsawClientService, useValue: mockWarsawClient },
      ],
    }).compile();

    service = module.get<WarsawStreamPositionsService>(WarsawStreamPositionsService);
    cache = module.get<Cache>(CACHE_MANAGER);
    warsawClient = module.get<WarsawClientService>(WarsawClientService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStreamOfPositions', () => {
    xit('should create cache entry if not present', async () => {
      const vehicle: WarsawVehiclePosition = { VehicleNumber: '1', Time: new Date().toISOString() };
      const response: WarsawVehiclePositionResponse = { result: [vehicle] };

      mockWarsawClient.getAllPositions.mockResolvedValue(response);
      mockCache.get.mockResolvedValue(undefined);

      const result: CachedVehicles = await service.getStreamOfPositions();

      expect(mockCache.set).toHaveBeenCalledWith(
        'vehicle-positions:vehicle:1',
        { positions: [vehicle] },
        10 * 60 * 1000
      );
      expect(result.vehicles.length).toBe(1);
      expect(result.vehicles[0].positions[0].VehicleNumber).toBe('1');
    });

    it('should update cache if new position has later time', async () => {
      const oldTime = moment().subtract(1, 'minutes').toISOString();
      const newTime = moment().toISOString();

      const vehicle: WarsawVehiclePosition = { VehicleNumber: '1', Time: newTime };
      const cached: { positions: WarsawVehiclePosition[] } = { positions: [{ VehicleNumber: '1', Time: oldTime }] };
      const response: WarsawVehiclePositionResponse = { result: [vehicle] };

      mockWarsawClient.getAllPositions.mockResolvedValue(response);
      mockCache.get.mockResolvedValue(cached);

      const result: CachedVehicles = await service.getStreamOfPositions();

      expect(mockCache.set).toHaveBeenCalledWith(
        'vehicle-positions:vehicle:1',
        expect.objectContaining({
          positions: expect.arrayContaining([vehicle])
        })
      );
      expect(result.vehicles.length).toBe(1);
      expect(result.vehicles[0].positions[0].VehicleNumber).toBe('1');
    });

    it('should not update cache if new position has same or older time', async () => {
      const time = moment().toISOString();

      const vehicle: WarsawVehiclePosition = { VehicleNumber: '1', Time: time };
      const cached: { positions: WarsawVehiclePosition[] } = { positions: [{ VehicleNumber: '1', Time: time }] };
      const response: WarsawVehiclePositionResponse = { result: [vehicle] };

      mockWarsawClient.getAllPositions.mockResolvedValue(response);
      mockCache.get.mockResolvedValue(cached);

      const result: CachedVehicles = await service.getStreamOfPositions();

      expect(mockCache.set).not.toHaveBeenCalled();
      expect(result.vehicles.length).toBe(1);
      expect(result.vehicles[0].positions[0].VehicleNumber).toBe('1');
    });
  });
});
