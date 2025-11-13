import { Module } from '@nestjs/common';
import { WarsawClientService } from './warsaw-client.service';
import { CacheModule } from '@nestjs/cache-manager';
import { WarsawStreamPositionsService } from './warsaw-stream-positions.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 20 * 1000 // Cache expiration time in milliseconds
    })
  ],
  exports: [
    WarsawClientService,
    WarsawStreamPositionsService
  ],
  providers: [
    WarsawClientService,
    WarsawStreamPositionsService
  ]
})
export class WarsawClientModule {
}
