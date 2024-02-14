import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthenticateModule } from '@article-workspace/authenticate'
import { SlackUserSchema, TokenSchema, UserSchema, getMongooseDbCongif } from '@article-workspace/data';
import { JwtStrategy, getJwtAuthConfig } from '@article-workspace/authentication';
// import { JwtModule } from '@nestjs/jwt';
import { ConfigModule} from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { getGlobalConfig } from '@article-workspace/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    getMongooseDbCongif(),
    getJwtAuthConfig(),
    getGlobalConfig(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Token', schema: TokenSchema }, { name: 'SlackUser', schema: SlackUserSchema }]),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
