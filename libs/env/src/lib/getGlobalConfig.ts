import { DynamicModule } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';

export const getGlobalConfig = (
  options: ConfigModuleOptions = {},
): DynamicModule => {
  return NestConfigModule.forRoot({ isGlobal: true, ...options });
};