import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { EmailService } from './email.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProfileController } from './profile.controller'; // Import the Profile Controller
import { User, UserSchema } from '../user/user.schema';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' }, // JWT expiration
    }),
    UserModule,
  ],
  providers: [AuthService, EmailService, JwtStrategy],
  controllers: [AuthController, ProfileController], // Add ProfileController
})
export class AuthModule {}
