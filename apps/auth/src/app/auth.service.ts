import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '@article-workspace/data'
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async slackOAuth(code: string): Promise<{ token: string }> {
    try {
      const response = await axios.post(process.env.SLACK_OAUTH2_URI, {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
      });
  
      const { ok, user } = response.data;
      if (!ok) {
        throw new Error('Failed to authenticate with Slack');
      }
  
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (!existingUser) {
        throw new UnauthorizedException('User not found');
      }
  
      const token = this.jwtService.sign({ id: existingUser._id });
  
      return { token };
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate with Slack');
    }
  }
}
