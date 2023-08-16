import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Put,
  UseInterceptors,
  UseGuards,
  Logger,
  Req,
  UnauthorizedException,
  Query,
  Inject,
} from '@nestjs/common';

import { Cache } from 'cache-manager';
import { UserService } from './user.service';
import {
  CacheInterceptor,
  CacheTTL,
  CacheKey,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  private logger = new Logger('UserController');
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly service: UserService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('getAllUsers')
  @CacheTTL(30)
  @Get('users')
  @ApiResponse({ status: 200, description: 'Get all users success' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiBearerAuth('Authorization')
  async getAllUsers(@Req() req, @Query() query) {
    this.logger.verbose(`User: ${req.user.email} Getting all users list`);
    if (req.user.role != 'admin') {
      throw new UnauthorizedException();
    }

    this.logger.log(`query param ${query['page']}`);
    this.logger.log(`query param ${query.page}`);
    return await this.service.getAllUsers(query.page);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('getSingleUser')
  @CacheTTL(30)
  @Get('users/:id')
  @ApiResponse({ status: 200, description: 'Get single user success' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiBearerAuth('Authorization')
  async getSingleUser(@Param('id') id, @Req() req) {
    if (
      req.user.role != 'admin' ||
      (req.user.role == 'normal' && id != req.user._id)
    ) {
      throw new UnauthorizedException();
    }
    this.logger.verbose(`User: ${req.user.email} Geting user: ${id}`);
    return await this.service.getSingleUser(id);
  }

  @Post('users')
  @ApiResponse({ status: 200, description: ' user created success' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiBearerAuth('Authorization')
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
    if (req.user.role != 'admin') {
      throw new UnauthorizedException();
    }
    this.logger.verbose(
      `User: ${req.user.email} creating user: ${createUserDto.name}`,
    );
    await this.cacheService.reset();
    return await this.service.createUser(createUserDto);
  }
  @Put('users/:id')
  @ApiResponse({ status: 200, description: ' user created success' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiBearerAuth('Authorization')
  async updateUserPut(
    @Body() createUserDto: CreateUserDto,
    @Param('id') id,
    @Req() req,
  ) {
    if (
      req.user.role != 'admin' ||
      (req.user.role == 'normal' && id != req.user._id)
    ) {
      throw new UnauthorizedException();
    }
    this.logger.verbose(
      `User: ${req.user.email} updating (put) user with id: ${id}`,
    );

    await this.cacheService.reset();
    return await this.service.updateUser(createUserDto, id, 'put');
  }
  @Patch('users/:id')
  @ApiResponse({ status: 200, description: ' user created success' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiBearerAuth('Authorization')
  async updateUserPatch(
    @Body() createUserDto: CreateUserDto,
    @Param('id') id,
    @Req() req,
  ) {
    if (req.user.role != 'admin') {
      throw new UnauthorizedException();
    }
    this.logger.verbose(
      `User: ${req.user.email} updating (patch) user with id: ${id}`,
    );

    await this.cacheService.reset();
    return await this.service.updateUser(createUserDto, id, 'patch');
  }

  @Delete('users/:id')
  @ApiResponse({ status: 204, description: ' user deleted success' })
  @ApiResponse({ status: 400, description: 'Not found' })
  @ApiBearerAuth('Authorization')
  async deleteUser(@Param('id') id, @Req() req) {
    if (req.user.role != 'admin') {
      throw new UnauthorizedException();
    }
    this.logger.verbose(`User: ${req.user.email} deleting user with id: ${id}`);

    await this.cacheService.reset();
    return await this.service.deletUser(id);
  }
}
