import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../configuration';

@Module({
  imports: [ConfigurationModule]
})
export class MainModule {}
