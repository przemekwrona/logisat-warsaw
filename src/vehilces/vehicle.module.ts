import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { WarsawClientModule } from '../client/warsaw-client/warsaw-client.module';

@Module({
  imports: [
    WarsawClientModule
  ],
  controllers: [VehicleController],
  providers: [
    VehicleService
  ],
})
export class VehicleModule {}
