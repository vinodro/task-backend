import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard) // Protect this route
  @Get()
  async getProfile(@Req() req) {
    return req.user; // req.user will contain the user data if authenticated
  }
}
