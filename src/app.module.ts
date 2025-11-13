import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WarsawClientModule } from './client/warsaw-client/warsaw-client.module';
import { VehicleModule } from './vehilces/vehicle.module';

@Module({
  imports: [
    WarsawClientModule,
    VehicleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
