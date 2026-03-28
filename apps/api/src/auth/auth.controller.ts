import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  // 준비 중
  // @Post('signup')
  // async signup(@Body() dto: SignupDto) {
  //   return this.authService.signup(dto);
  // }

  // @Post('login')
  // async login(@Body() dto: LoginDto) {
  //   return this.authService.login(dto);
  // }

  // @Post('refresh')
  // async refresh(@Body() dto: RefreshTokenDto) {
  //   return this.authService.refresh(dto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // async logout(@Request() req: { user: { id: string } }) {
  //   return this.authService.logout(req.user.id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('me')
  // async getMe(@Request() req: { user: { id: string } }) {
  //   return this.usersService.findById(req.user.id);
  // }
}
