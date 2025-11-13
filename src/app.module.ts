import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WarsawClientModule } from './client/warsaw-client/warsaw-client.module';
import { DelayModule } from './delay/delay.module';

@Module({
  imports: [
    WarsawClientModule,
    DelayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
