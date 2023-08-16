import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Logger,
} from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User, UserDocument } from '../user/user.schema';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private readonly service: AuthService) {}
  @Post('signup')
  @ApiResponse({ status: 200, description: 'sign up successful.' })
  @ApiResponse({ status: 400, description: 'data not valid.' })
  @ApiBody({
    type: AuthDto,
    description: 'Sign up Dto',
  })
  async singup(@Body() signupDto: AuthDto) {
    this.logger.verbose(`UserDto: ${JSON.stringify(signupDto)} signing up`);
    return await this.service.signup(signupDto);
  }
  @Post('login')
  @ApiResponse({ status: 200, description: 'login successful.' })
  @ApiResponse({ status: 400, description: 'email/password is wrong.' })
  @ApiBody({
    type: AuthDto,
    description: 'login Dto',
  })
  async login(@Body() loginDto: AuthDto): Promise<{ token: string }> {
    this.logger.verbose(`UserDto: ${JSON.stringify(loginDto)} logging in`);
    return await this.service.login(loginDto);
  }
}
