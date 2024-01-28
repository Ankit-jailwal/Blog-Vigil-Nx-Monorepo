// JwtModule.registerAsync({
//     inject: [ConfigService],
//     useFactory: (config: ConfigService) => {
//       console.log(`jwt secret ${config.get<string>('JWT_SECRET')}`)
//       return {
//         secret: config.get<string>('JWT_SECRET'),
//         signOptions: {
//           expiresIn: config.get<string | number>('JWT_EXPIRES'),
//         },
//       };
//     },
//   }),

import { DynamicModule } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";


export const getJwtConfig = () : DynamicModule => {
    return JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          console.log(`jwt secret ${config.get<string>('JWT_SECRET')}`)
          return {
            secret: config.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: config.get<string | number>('JWT_EXPIRES'),
            },
          };
        },
      });
};