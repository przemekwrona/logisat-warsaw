import { Inject, Injectable } from '@nestjs/common';
import { WarsawClientService } from '../client/warsaw-client/warsaw-client.service';
import {
  WarsawVehiclePosition,
  WarsawVehiclePositionResponse,
} from '../generated/public-transport-api';
import {
  VehicleVelocity,
  VehicleVelocityResponse,
} from '../generated/logisat-api';
import moment, { Moment } from 'moment';
import haversineDistance from 'haversine-distance';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class DelayService {
  constructor(
    private warsawClientService: WarsawClientService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getLastPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.warsawClientService.getAllPositions();
  }

  async getVelocity(): Promise<VehicleVelocityResponse> {
    const lastPositions: WarsawVehiclePositionResponse =
      await this.getLastPositions();

    const vehicleVelocities: VehicleVelocity[] = await Promise.all(
      (lastPositions.result || []).map(async (currentPosition) => {
        const historicalPosition =
          await this.cacheManager.get<WarsawVehiclePosition>(
            currentPosition.VehicleNumber,
          );

        if (!historicalPosition) {
          return {
            vehicleNumber: currentPosition.VehicleNumber,
            line: currentPosition.Lines || '',
            velocity: 0,
          };
        }

        const historicalTime = moment(historicalPosition.Time);
        const currentTime = moment(currentPosition.Time);

        const deltaTimeInSeconds = currentTime.diff(historicalTime, 'seconds');

        if (deltaTimeInSeconds === 0) {
          return {
            vehicleNumber: currentPosition.VehicleNumber,
            line: currentPosition.Lines || '',
            velocity: 0,
          };
        }

        const distanceInMeters = haversineDistance(
          {
            lat: historicalPosition.Lat || 0,
            lon: historicalPosition.Lon || 0,
          },
          {
            lat: currentPosition.Lat,
            lon: currentPosition.Lon,
          },
        );

        const velocityMetersPerSecond = Math.floor(distanceInMeters / deltaTimeInSeconds);

        console.log(distanceInMeters + ' ' + deltaTimeInSeconds + ' ' + velocityMetersPerSecond);

        return {
          vehicleNumber: currentPosition.VehicleNumber,
          line: currentPosition.Lines || '',
          velocity: velocityMetersPerSecond,
        };
      }),
    );

    lastPositions.result?.forEach((vehicle: WarsawVehiclePosition) =>
      this.cacheManager.set(vehicle.VehicleNumber, vehicle),
    );

    const response: VehicleVelocityResponse = {
      vehicles: vehicleVelocities
    };

    return Promise.resolve(response);
  }
}
