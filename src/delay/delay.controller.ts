import { Controller, Get } from '@nestjs/common';
import { DelayService } from './delay.service';
import { WarsawVehiclePositionResponse } from '../generated/public-transport-api';
import { VehicleVelocityResponse } from '../generated/logisat-api';

@Controller('/api/v1')
export class DelayController {

  constructor(private delayService: DelayService ) {
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
