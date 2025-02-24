import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { LoginDto } from "src/dto/login.dto";
import { RegisterDto } from "src/dto/register.dto";
import { AuthService } from "src/services/auth.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
