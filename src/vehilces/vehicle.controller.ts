import { Controller, Get } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { WarsawVehiclePositionResponse } from '../generated/public-transport-api';
import { VehicleVelocityResponse } from '../generated/logisat-api';

@Controller('/api/v1')
export class VehicleController {

  constructor(private delayService: VehicleService ) {
  }

  @Get("/positions")
  async getLastPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.delayService.getLastPositions();
  }

  @Get("/delays")
  async getDelays(): Promise<VehicleVelocityResponse> {
    return this.delayService.getVelocity();
  }
}
