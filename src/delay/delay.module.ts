import { Module } from '@nestjs/common';
import { DelayController } from './delay.controller';
import { DelayService } from './delay.service';
import { WarsawClientModule } from '../client/warsaw-client/warsaw-client.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    WarsawClientModule,
    CacheModule.register({
      ttl: 60 * 1000, // Cache expiration time in milliseconds
    }),
  ],
  controllers: [DelayController],
  providers: [DelayService],
})
export class DelayModule {}
