import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('/slack/callback')
  async slackCallback(@Query('code') code: string) {
    console.log("Temp code: ", code);
    return await this.authService.slackOAuth(code);
  }

  @Post('/slack/verify')
  async verifySlackRequest(@Body() payload: any) {
    console.log("Verification payload ",payload);
    return this.authService.slackRequestVerification(payload.request, payload.metadata);
  }
}
