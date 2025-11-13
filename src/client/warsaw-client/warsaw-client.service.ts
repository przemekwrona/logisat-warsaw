import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WarsawVehiclePositionResponse } from '../../generated/public-transport-api';

export enum VehicleType {
  BUSES = 1,
  TRAMS = 2,
}

@Injectable()
export class WarsawClientService {
  private POSITION_RESOURCE_KEY = 'f2e5503e927d-4ad3-9500-4ab9e55deb59';

  async getWarsawTramsPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.getWarsawPositions(VehicleType.TRAMS);
  }

  async getWarsawBusesPositions(): Promise<WarsawVehiclePositionResponse> {
    return this.getWarsawPositions(VehicleType.BUSES);
  }

  async getWarsawPositions(
    vehicleType: VehicleType,
  ): Promise<WarsawVehiclePositionResponse> {
    const url: string = `https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=${this.POSITION_RESOURCE_KEY}&apikey=35d54d63-c436-4ef7-a98b-774bed55b393&type=${vehicleType}`;
    const response = await axios.get(url);
    return response.data;
  }
}
