import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthenticateModule } from '@article-workspace/authenticate'
import { UserSchema, getMongooseDbCongif } from '@article-workspace/data';
import { JwtStrategy, getJwtConfig } from '@article-workspace/authenticate';
// import { JwtModule } from '@nestjs/jwt';
import { ConfigModule} from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    getMongooseDbCongif(),
    getJwtConfig(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
