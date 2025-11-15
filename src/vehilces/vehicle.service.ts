import { Injectable } from '@nestjs/common';
import { WarsawClientService } from '../client/warsaw-client/warsaw-client.service';
import {
  WarsawVehiclePosition,
  WarsawVehiclePositionResponse,
} from '../generated/public-transport-api';
import {
  VehicleVelocityResponse,
} from '../generated/logisat-api';
import { calculateVelocity } from './geo-utils';
import {
  CachedVehiclePositions,
  CachedVehicles,
  WarsawStreamPositionsService,
} from '../client/warsaw-client/warsaw-stream-positions.service';

@Injectable()
export class VehicleService {
  constructor(
    private warsawClientService: WarsawClientService,
    private warsawStreamPositionsService: WarsawStreamPositionsService,
  ) {}

  async getLastPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.warsawClientService.getAllPositions();
  }

  async getVelocity(): Promise<VehicleVelocityResponse> {
    const cachedVehicles: CachedVehicles =
      await this.warsawStreamPositionsService.getStreamOfPositions();

    const vehicles = (cachedVehicles.vehicles || [])
      .map((vehicle: CachedVehiclePositions) => this.buildVehicleVelocity(vehicle));

    return Promise.resolve({ vehicles: vehicles } as VehicleVelocityResponse);
  }

  private buildVehicleVelocity(vehicle: CachedVehiclePositions) {
    const lastPosition: WarsawVehiclePosition = vehicle.positions[0];
    const previousPosition: WarsawVehiclePosition = vehicle.positions[1];

    const velocityMetersPerSecond = calculateVelocity(
      previousPosition,
      lastPosition,
    );

    return {
      vehicleNumber: lastPosition.VehicleNumber,
      line: lastPosition.Lines || '',
      velocity: velocityMetersPerSecond,
    };
  }

  async getVelocityByVehicle(vehicleId: string): Promise<VehicleVelocityResponse> {
    const cachedVehicles: CachedVehicles = await this.warsawStreamPositionsService.getStreamOfPositions();

    const vehicles = (cachedVehicles.vehicles || [])
      .filter((vehicle: CachedVehiclePositions) => vehicle.positions[0].VehicleNumber === vehicleId)
      .map((vehicle: CachedVehiclePositions) => this.buildVehicleVelocity(vehicle));

    return Promise.resolve({ vehicles: vehicles } as VehicleVelocityResponse);
  }
}
