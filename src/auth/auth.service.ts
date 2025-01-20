import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { EmailService } from './email.service';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserDto) {
    const { email } = userDto;

    // Check if the user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Create the user
    const user = await this.userService.createUser(userDto);

    // Generate email verification token
    const verificationToken = this.generateVerificationToken(user.email);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      message:
        'User registered. Please check your email to verify your account.',
    };
  }

  async logIn(userDto: UserDto) {
    const { email, password } = userDto;

    // Find the user
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // // Check if the user is verified
    // if (!user.isVerified) {
    //   throw new UnauthorizedException('Account is not verified');
    // }
    // Check if the user is verified
    if (!user.isVerified) {
      // Generate email verification token
      const verificationToken = this.generateVerificationToken(user.email);

      // Send verification email
      await this.emailService.sendVerificationEmail(
        user.email,
        verificationToken,
      );

      return {
        message:
          'Account is not verified. Please check your email for a verification code.',
      };
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(
      user.email,
      user._id.toString(),
    );
    const refreshToken = this.generateRefreshToken(user._id.toString());

    // Save the refresh token in the database
    await this.userService.updateRefreshToken(
      user._id.toString(),
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'secret',
      ) as any;

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new Error('Invalid refresh token');
      }
      // Generate a new access token
      const accessToken = this.generateAccessToken(
        user.email,
        user._id.toString(),
      );
      return { accessToken };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  private generateVerificationToken(email: string): string {
    return jwt.sign({ email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '5m',
    });
  }

  private generateAccessToken(email: string, userId: string): string {
    return this.jwtService.sign(
      { email, sub: userId },
      { secret: process.env.JWT_SECRET || 'secret', expiresIn: '1m' },
    );
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { sub: userId },
      process.env.JWT_REFRESH_SECRET || 'secret',
      {
        expiresIn: '1d',
      },
    );
  }

  async verifyEmail(token: string) {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret',
      ) as any;

      // Find the user by email
      const user: User | null = await this.userService.findByEmail(
        payload.email,
      );
      if (!user) {
        throw new Error('User not found');
      }

      const userDocument = user as User & Document;

      // Mark the user as verified in the database
      userDocument.isVerified = true;
      await userDocument.save();

      return { message: 'Email successfully verified!' };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
