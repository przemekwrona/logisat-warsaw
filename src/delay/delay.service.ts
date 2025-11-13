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

@Injectable()
export class DelayService {
  private historicalPositions: Map<string, WarsawVehiclePosition> = new Map<
    string,
    WarsawVehiclePosition
  >();

  constructor(private warsawClientService: WarsawClientService) {}

  async getLastPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.warsawClientService.getAllPositions();
  }

  async getVelocity(): Promise<VehicleVelocityResponse> {
    const lastPositions: WarsawVehiclePositionResponse =
      await this.getLastPositions();

    const vehicleVelocity: VehicleVelocity[] =
      lastPositions.result?.map((currentPositions: WarsawVehiclePosition) => {
        const historicalPosition = this.historicalPositions.get(currentPositions.VehicleNumber);

        const velocity: number = historicalPosition === null ? 0 : 20;

        return {
          vehicleNumber: currentPositions.VehicleNumber,
          line: currentPositions.Lines || '',
          velocity: velocity,
        } as VehicleVelocity;
      }) || [];

    this.rebuildHistoricalPositions(lastPositions);

    const response: VehicleVelocityResponse = {
      vehicles: vehicleVelocity,
    };

    return Promise.resolve(response);
  }

  private rebuildHistoricalPositions(lastPositions: WarsawVehiclePositionResponse): void {
    this.historicalPositions = new Map<string, WarsawVehiclePosition>(
      lastPositions.result?.map((vehicle: WarsawVehiclePosition) => [
        vehicle.VehicleNumber,
        vehicle,
      ]),
    );
  }
}
