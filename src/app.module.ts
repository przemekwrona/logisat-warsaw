import { Module } from '@nestjs/common';
import { VehicleModule } from './vehilces/vehicle.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    VehicleModule,
    UserModule
  ]
})
export class AppModule {}
