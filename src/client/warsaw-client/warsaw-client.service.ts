import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { WarsawVehiclePositionResponse } from '../../generated/public-transport-api';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

export enum VehicleType {
  BUSES = 1,
  TRAMS = 2,
}

@Injectable()
export class WarsawClientService {
  private POSITION_RESOURCE_KEY = 'f2e5503e927d-4ad3-9500-4ab9e55deb59';

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {
  }

  async getAllPositions(): Promise<WarsawVehiclePositionResponse> {
    return Promise.all([
      this.getWarsawBusesPositions(),
      this.getWarsawTramsPositions(),
    ]).then((responses) => {
      const buses = responses[0];
      const trams = responses[1];

      return {
        result: [...(buses.result || []), ...(trams.result || [])],
      } as WarsawVehiclePositionResponse;
    });
  }

  async getWarsawTramsPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.getWarsawPositions(VehicleType.TRAMS);
  }

  async getWarsawBusesPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.getWarsawPositions(VehicleType.BUSES);
  }

  async getWarsawPositions(
    vehicleType: VehicleType,
  ): Promise<WarsawVehiclePositionResponse> {
    const cacheKey = `warsaw-positions:vehicle-type:${vehicleType}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const url: string = `https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=${this.POSITION_RESOURCE_KEY}&apikey=35d54d63-c436-4ef7-a98b-774bed55b393&type=${vehicleType}`;
    const response = await axios.get(url);

    await this.cache.set(cacheKey, response.data);
    return response.data;
  }
}
