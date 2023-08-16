import { Injectable, NotAcceptableException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { AuthDto } from './auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async signup(signupDto: AuthDto): Promise<{ id: string; token: string }> {
    const { email, password } = signupDto;
    const existedUser = await this.userModel.findOne({
      email,
    });
    if (existedUser != null) {
      throw new NotAcceptableException('user already exist');
    }

    signupDto.password = await argon.hash(password);
    const newUser = await new this.userModel({
      ...signupDto,
    }).save();

    const token: string = await this.signjwt(email, newUser._id);
    return { id: newUser._id, token };
  }

  async login(loginDto: AuthDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const foundedUser = await this.userModel.findOne({
      email,
    });
    if (foundedUser == null) {
      throw new NotAcceptableException('email or password is wrong');
    }
    if (await argon.verify(foundedUser.password, password)) {
      // let accessTokensignjwt:string =await this.signjwt(email)
      return { token: await this.signjwt(email, foundedUser._id) };
    }

    throw new NotAcceptableException('email or password is wrong');
  }

  async signjwt(email: string, id: string): Promise<string> {
    const payload: JwtPayload = { email, id };
    const accessToken: string = await this.jwtService.sign(payload);
    return accessToken;
  }
}
