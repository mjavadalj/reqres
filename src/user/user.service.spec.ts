import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './user.schema';
import { NotFoundException } from '@nestjs/common';

const mockUserModel = () => ({
  findOne: jest.fn(),
});

describe('UserService', () => {
  let service;
  let userRepo: Model<UserDocument>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get(UserService);
    service.findOne = jest.fn();

    userRepo = module.get(getModelToken(User.name));
    userRepo.findOne = jest.fn();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get single user success', async () => {
    service.findOne.mockResolvedValue('some');
    const result = await service.getSingleUser('ojefj3i38dhu3w');
    expect(service.findOne).toHaveBeenCalled();
    expect(result).toEqual('some');
  });
});
