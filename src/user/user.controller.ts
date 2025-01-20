import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard'; // Import the Auth Guard
import { UserDto } from './dto/user.dto';
import { Validate, validate } from 'class-validator';
import { plainToClass, plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('register')
  // async register(@Body() userDto: UserDto) {
  //   // Transform the plain object into a class instance
  //   const userInstance = plainToInstance(UserDto, userDto);
  //   console.log(userInstance, 'fdfd');

  //   const errors = await validate(userDto);
  //   if (errors.length > 0) {
  //     // Collect error messages from validation failures
  //     const errorMessages = errors.map((error) =>
  //       Object.values(error.constraints || {}).join(', '),
  //     );
  //     throw new BadRequestException(
  //       `Validation failed: ${errorMessages.join('; ')}`,
  //     );
  //   }

  //   try {
  //     // Attempt to create the user
  //     return await this.userService.createUser(userDto);
  //   } catch (error) {
  //     if (error.code === 11000 && error.keyValue?.email) {
  //       // Handle MongoDB duplicate key error for email
  //       throw new ConflictException(
  //         `User with email '${error.keyValue.email}' already exists.`,
  //       );
  //     }
  //     // Re-throw other errors
  //     throw error;
  //   }
  // }

  // Protected Route Example
  @Post('get-profile')
  @UseGuards(JwtAuthGuard) // Protect this route with the JwtAuthGuard
  async getProfile() {
    return { message: 'This is a protected user profile' };
  }
}
