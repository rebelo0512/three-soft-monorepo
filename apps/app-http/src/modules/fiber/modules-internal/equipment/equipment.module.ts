import { Module } from '@nestjs/common';
import { PopModule } from './modules-internal';

@Module({
  imports: [PopModule]
})
export class EquipmentModule {}
