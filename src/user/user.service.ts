import {
  Injectable,
  NotAcceptableException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

import { CreateUserDto } from './dto/admin/createUser.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async getAllUsers(page: number) {
    const total = await this.userModel.find().count();
    const result = {
      page,
      per_page: 6,
      total,
      total_pages: Math.ceil(total / 6),
      data: await this.userModel
        .find()
        .limit(6)
        .skip(page * 6)
        .exec(),
    };
    return result;
  }
  async getSingleUser(id) {
    const data = await this.userModel.findOne({ _id: id }).exec(); //foundedUser
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, job } = createUserDto;
    return await new this.userModel({ name, job }).save();
  }
  async updateUser(
    createUserDto: CreateUserDto,
    id: string,
    routeMethod: string,
  ): Promise<User> {
    const { name, job } = createUserDto;
    const foundedUser = await this.userModel.findOne({ _id: id }).exec();
    if (!foundedUser && routeMethod == 'patch') {
      throw new NotFoundException('user Not Found');
    }
    if (!foundedUser && routeMethod == 'put') {
      return await new this.userModel({ name, job });
    }

    return await this.userModel
      .findByIdAndUpdate({ _id: id }, { name, job })
      .exec();
  }
  async deletUser(id: string) {
    const foundedUser = await this.userModel.findOne({ _id: id }).exec();
    if (!foundedUser) {
      throw new NotFoundException('user Not Found');
    }

    const deletedUser = await this.userModel
      .findOneAndDelete({ _id: id })
      .exec();
    // throw new GoneException();
    return {};
  }
}
