import { Injectable } from '@nestjs/common';
import { WarsawClientService } from '../client/warsaw-client/warsaw-client.service';
import { VehiclesGet200Response } from '../generated/public-transport-api';

@Injectable()
export class DelayService {

  constructor(private warsawClientService: WarsawClientService) {}

  async getLastPositions(): Promise<VehiclesGet200Response> {
    return Promise.all([
      this.warsawClientService.getWarsawBusesPositions(),
      this.warsawClientService.getWarsawTramsPositions(),
    ]).then((responses) => {
      const buses = responses[0];
      const trams = responses[1];

      return {
        result: [...(buses.result || []), ...(trams.result || [])],
      } as VehiclesGet200Response;
    });
  }
}
