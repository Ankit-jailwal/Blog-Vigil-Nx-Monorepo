import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from '@article-workspace/data';
import { MongooseModule } from '@nestjs/mongoose';
import { getGlobalConfig } from '@article-workspace/env';

@Module({
  imports: [
    getGlobalConfig(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthenticationModule {}