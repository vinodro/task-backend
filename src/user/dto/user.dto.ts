import { IsEmail, IsString, MinLength, Length } from 'class-validator';

export class UserDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
