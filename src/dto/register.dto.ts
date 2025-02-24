import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @MinLength(1, { message: 'First name is required' })
  firstName: string;

  @IsString()
  @MinLength(1, { message: 'Last name is required' })
  lastName: string;
}
