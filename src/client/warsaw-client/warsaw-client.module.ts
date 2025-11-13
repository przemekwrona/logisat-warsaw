import { Module } from '@nestjs/common';
import { WarsawClientService } from './warsaw-client.service';

@Module({
  exports: [
    WarsawClientService
  ],
  providers: [
    WarsawClientService
  ]
})
export class WarsawClientModule {
}
