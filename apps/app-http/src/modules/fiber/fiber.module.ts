import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { EquipmentModule, PopModule } from './modules-internal';

const prefix = 'fiber/api';

@Module({
  imports: [
    EquipmentModule,
    RouterModule.register([
      {
        path: `${prefix}/equipment`,
        module: EquipmentModule,
        children: [
          {
            path: 'pop',
            module: PopModule
          }
        ]
      }
    ])
  ]
})
export class FiberModule {}
