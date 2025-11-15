import { Controller, Get, Param } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { WarsawVehiclePositionResponse } from '../generated/public-transport-api';
import { VehicleVelocityResponse } from '../generated/logisat-api';

@Controller('/api/v1/vehicles')
export class VehicleController {

  constructor(private vehicleService: VehicleService ) {
  }

  @Get("/positions")
  async getLastPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.vehicleService.getLastPositions();
  }

  @Get("/velocity")
  async getVelocity(): Promise<VehicleVelocityResponse> {
    return this.vehicleService.getVelocity();
  }

  @Get("/:vehicleId/velocity")
  async getVelocityByVehicle(@Param('vehicleId') vehicleId: string): Promise<VehicleVelocityResponse> {
    return this.vehicleService.getVelocityByVehicle(vehicleId);
  }
}
