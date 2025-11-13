import { Injectable } from '@nestjs/common';
import { WarsawClientService } from './client/warsaw-client/warsaw-client.service';

@Injectable()
export class AppService {

  constructor(private warsawClientService: WarsawClientService) {
  }

  getHello(): string {
    this.warsawClientService.getWarsawBusesPositions();
    return 'Hello World!';
  }
}
