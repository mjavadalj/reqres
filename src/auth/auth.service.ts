import { Injectable, NotAcceptableException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { AuthDto } from '../user/dto/auth.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async signup(signupDto: AuthDto): Promise<User> {
    const existedUser = await this.userModel.findOne({
      email: signupDto.email,
    });
    if (existedUser != null) {
      throw new NotAcceptableException('user already exist');
    }

    signupDto.password = await argon.hash(signupDto.password);
    return await new this.userModel({
      ...signupDto,
    }).save();
  }

  async login(loginDto: AuthDto): Promise<User> {
    const foundedUser = await this.userModel.findOne({
      email: loginDto.email,
    });
    if (foundedUser == null) {
      throw new NotAcceptableException('email or password is wrong');
    }
    if (await argon.verify(foundedUser.password, loginDto.password)) {
      return foundedUser;
    }
  }
}
