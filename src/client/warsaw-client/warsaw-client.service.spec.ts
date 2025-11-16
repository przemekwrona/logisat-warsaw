import { Test, TestingModule } from '@nestjs/testing';
import { WarsawClientService, VehicleType } from './warsaw-client.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { WarsawVehiclePositionResponse } from '../../generated/public-transport-api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WarsawClientService', () => {
  let service: WarsawClientService;
  let cache: Cache;

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarsawClientService,
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<WarsawClientService>(WarsawClientService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWarsawPositions', () => {
    it('should return cached data if available', async () => {
      const cachedData: WarsawVehiclePositionResponse = { result: [{ id: 1 }] };
      mockCache.get.mockResolvedValueOnce(cachedData);

      const result = await service.getWarsawPositions(VehicleType.BUSES);

      expect(result).toEqual(cachedData);
      expect(mockCache.get).toHaveBeenCalledWith(
        'warsaw-positions:vehicle-type:1',
      );
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch data from API if not cached and cache it', async () => {
      mockCache.get.mockResolvedValueOnce(null);
      const apiData: WarsawVehiclePositionResponse = { result: [{ id: 2 }] };
      mockedAxios.get.mockResolvedValueOnce({ data: apiData });

      const result = await service.getWarsawPositions(VehicleType.TRAMS);

      expect(result).toEqual(apiData);
      expect(mockCache.get).toHaveBeenCalledWith(
        'warsaw-positions:vehicle-type:2',
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockCache.set).toHaveBeenCalledWith(
        'warsaw-positions:vehicle-type:2',
        apiData,
      );
    });
  });

  describe('getAllPositions', () => {
    it('should combine buses and trams positions', async () => {
      const busesData: WarsawVehiclePositionResponse = { result: [{ id: 1 }] };
      const tramsData: WarsawVehiclePositionResponse = { result: [{ id: 2 }] };

      jest
        .spyOn(service, 'getWarsawBusesPositions')
        .mockResolvedValueOnce(busesData);
      jest
        .spyOn(service, 'getWarsawTramsPositions')
        .mockResolvedValueOnce(tramsData);

      const result = await service.getAllPositions();

      expect(result).toEqual({ result: [{ id: 1 }, { id: 2 }] });
    });
  });
});
