import { Injectable } from '@nestjs/common';
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

@Injectable()
export class DelayService {
  private historicalPositions: Map<string, WarsawVehiclePosition> = new Map<string, WarsawVehiclePosition>();

  constructor(private warsawClientService: WarsawClientService) {}

  async getLastPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.warsawClientService.getAllPositions();
  }

  async getVelocity(): Promise<VehicleVelocityResponse> {
    const lastPositions: WarsawVehiclePositionResponse =
      await this.getLastPositions();

    console.log(this.historicalPositions)

    const vehicleVelocity: VehicleVelocity[] =
      lastPositions.result?.map((currentPositions: WarsawVehiclePosition) => {
        const historicalPosition = this.historicalPositions.get(
          currentPositions.VehicleNumber,
        );


        const historicalTime: Moment = moment(historicalPosition?.Time);
        const currentTime: Moment = moment(currentPositions?.Time);
        const deltaTimeInSeconds = historicalTime.diff(currentTime, 'seconds');


        const distanceInMeters = haversineDistance(
          {
            lat: historicalPosition?.Lat || 0.0,
            lon: historicalPosition?.Lon || 0.0,
          },
          {
            lat: currentPositions.Lat,
            lon: currentPositions.Lon
          },
        );

        const velocityMetersPerSeconds: number = distanceInMeters / deltaTimeInSeconds;

        return {
          vehicleNumber: currentPositions.VehicleNumber,
          line: currentPositions.Lines || '',
          velocity: ~~velocityMetersPerSeconds,
        } as VehicleVelocity;
      }) || [];

    this.rebuildHistoricalPositions(lastPositions);

    const response: VehicleVelocityResponse = {
      vehicles: vehicleVelocity,
    };

    return Promise.resolve(response);
  }

  private rebuildHistoricalPositions(
    lastPositions: WarsawVehiclePositionResponse,
  ): void {
    this.historicalPositions = new Map<string, WarsawVehiclePosition>(
      lastPositions.result?.map((vehicle: WarsawVehiclePosition) => [
        vehicle.VehicleNumber,
        vehicle,
      ]),
    );
  }
}
