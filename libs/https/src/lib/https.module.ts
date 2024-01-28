import { Module } from '@nestjs/common';
import { HttpsService } from './https.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [HttpsService],
  exports: [HttpsService],
})
export class HttpsModule {}
