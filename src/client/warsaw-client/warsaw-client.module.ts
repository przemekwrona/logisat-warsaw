import { Module } from '@nestjs/common';
import { WarsawClientService } from './warsaw-client.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 20 * 1000 // Cache expiration time in milliseconds
    })
  ],
  exports: [
    WarsawClientService
  ],
  providers: [
    WarsawClientService
  ]
})
export class WarsawClientModule {
}
