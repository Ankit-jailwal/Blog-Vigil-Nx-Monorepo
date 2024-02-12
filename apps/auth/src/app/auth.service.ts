import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@article-workspace/data'
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Token.name)
    private tokenModel: Model<Token>,
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

  async getSlackUserDetails(accessToken) {
    const slackUrl = 'https://slack.com/api/users.identity';
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        const response = await axios.get(slackUrl, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching user details from Slack:', error);
        throw error;
    }
};

  async slackOAuth(code: string): Promise<string> {
    console.log(code);
    try {
      const slackUrl = `https://slack.com/api/openid.connect.token`;
      const client_id = process.env.SLACK_CLIENT_ID;
      const client_secret = process.env.SLACK_CLIENT_SECRET;
      const details = {
          code,
          client_id,
          client_secret
      }
      const formBody = Object.entries(details)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
      
      const _headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
      };
      
      const config = {
          method: 'POST',
          url: slackUrl,
          data: formBody,
          headers: _headers
      };
      const response = await axios(config);
      console.log(response.data);
      const { ok, id_token } = response.data;
      console.log(ok);
      if (!ok) {
        throw new Error('Failed to authenticate with Slack');
      }
      console.log(id_token);
      const slackUser = await jwt.decode(id_token) as any;

      console.log(slackUser);
      let user;
      if(slackUser.email && slackUser.email_verified)
            user = await this.userModel.findOne({ email: slackUser.email });

      console.log(slackUser)
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
    
      console.log(user);
    const token = this.jwtService.sign({ id: user._id });
      
    console.log("here");
    const tokenQuery = await this.tokenModel.findOneAndUpdate(
      { slackid: slackUser.sub }, 
      { $set: { token: token } },
    );
    if (!tokenQuery) {
      console.log("Token not found. Created a new one.");
    } else {
      console.log("Token updated successfully.");
    }

      return "Authorization successful";
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Failed to authenticate with Slack');
    }
  }
}
