import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { WarsawClientService } from './warsaw-client.service';
import {
  WarsawVehiclePosition,
  WarsawVehiclePositionResponse,
} from '../../generated/public-transport-api';
import moment from 'moment/moment';

export interface CachedVehiclePositions {
  positions: WarsawVehiclePosition[];
}

export interface CachedVehicles {
  vehicles: CachedVehiclePositions[];
}

@Injectable()
export class WarsawStreamPositionsService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private warsawClient: WarsawClientService,
  ) {}

  private readonly _10_MINUTES: number = 10 * 60 * 1000;

  async getStreamOfPositions(): Promise<CachedVehicles> {
    const positionsResponse: WarsawVehiclePositionResponse =
      await this.warsawClient.getAllPositions();

    for (const vehicle of positionsResponse.result ?? []) {
      const cacheKey = `vehicle-positions:vehicle:${vehicle.VehicleNumber}`;

      const cachedPositions: CachedVehiclePositions | undefined =
        await this.cache.get(cacheKey);

      if (cachedPositions === undefined) {
        const cachedPosition = {
          positions: [vehicle],
        } as CachedVehiclePositions;
        await this.cache.set(cacheKey, cachedPosition, this._10_MINUTES);
      } else {
        const lastCachedPosition: WarsawVehiclePosition =
          cachedPositions.positions[0];

        const deltaTimeInCache = moment(vehicle.Time).diff(
          moment(lastCachedPosition?.Time),
          'seconds',
        );

        if (deltaTimeInCache > 0) {
          cachedPositions.positions = [
            vehicle,
            ...cachedPositions.positions.slice(0, 10)
          ];
          await this.cache.set(cacheKey, cachedPositions);
        }
      }
    }

    const cachedPositions = await Promise.all(
      positionsResponse.result?.map((vehicle) => {
        const cacheKey = `vehicle-positions:vehicle:${vehicle.VehicleNumber}`;

        return this.cache.get(cacheKey);
      }) || [],
    );

    return Promise.resolve({
      vehicles: cachedPositions,
    } as CachedVehicles);
  }
}
