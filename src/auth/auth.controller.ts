import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard'; // Import the Auth Guard
import { UserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userDto: UserDto) {
    return this.authService.logIn(userDto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshAccessToken(body.refreshToken);
  }

  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
  // Protected Route Example
  @Post('protected')
  @UseGuards(JwtAuthGuard) // Protect this route with the JwtAuthGuard
  async protectedRoute() {
    return { message: 'You have access to this protected route!' };
  }
}
