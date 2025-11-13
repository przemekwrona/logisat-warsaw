import { Controller, Get } from '@nestjs/common';
import { DelayService } from './delay.service';
import { VehiclesGet200Response } from '../generated/public-transport-api';

@Controller('/api/v1')
export class DelayController {

  constructor(private delayService: DelayService ) {
  }

  @Get("/positions")
  async getLastPositions(): Promise<VehiclesGet200Response> {
    return this.delayService.getLastPositions();
  }
}
