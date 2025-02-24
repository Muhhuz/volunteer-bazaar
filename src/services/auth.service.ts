import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service'; // assuming you have a UserService to interact with your DB
import * as bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Registration logic
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    
    // Check if the user already exists
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user (assuming the createUser method exists)
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.generateJwt(user);
  }

  // Login logic
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find the user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwt(user);
  }

  // Generate JWT token
  private generateJwt(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
