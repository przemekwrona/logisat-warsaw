import { Module } from '@nestjs/common';
import { DelayController } from './delay.controller';
import { DelayService } from './delay.service';
import { WarsawClientModule } from '../client/warsaw-client/warsaw-client.module';

@Module({
  imports: [WarsawClientModule],
  controllers: [DelayController],
  providers: [DelayService]
})
export class DelayModule {}
