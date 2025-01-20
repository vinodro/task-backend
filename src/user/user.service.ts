import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userDto: UserDto): Promise<User> {
    const { name, email, password } = userDto;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedToken,
    });
  }

  async clearRefreshToken(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  // async comparePassword(
  //   plainPassword: string,
  //   hashedPassword: string,
  // ): Promise<boolean> {
  //   return bcrypt.compare(plainPassword, hashedPassword);
  // }
}
