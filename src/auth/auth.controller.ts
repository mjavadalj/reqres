import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthDto } from '../user/dto/auth.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('signup')
  async singup(@Body() signupDto: AuthDto) {
    return await this.service.signup(signupDto);
  }
  @Post('login')
  async login(@Body() loginDto: AuthDto) {
    return await this.service.login(loginDto);
  }
}
