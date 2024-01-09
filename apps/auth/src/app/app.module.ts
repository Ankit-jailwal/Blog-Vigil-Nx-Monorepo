import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthenticateModule } from '@article-workspace/authenticate'
import { UserSchema } from '@article-workspace/data';
import { JwtStrategy } from '@article-workspace/authenticate';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'articledbnx',
    }),
    JwtModule.registerAsync({
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
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
