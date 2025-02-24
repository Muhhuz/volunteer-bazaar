import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; // Add JwtModule for JWT functionality
import { databaseConfig } from './config/database.config';
import { UserModule } from './modules/user.module'; // Ensure correct path
import { EventModule } from './modules/event.module';
import { HealthController } from './controllers/health.controller';
import { AuthController } from './controllers/auth.controller';
import { AdminEventController } from './controllers/admin.controller';
import { AuthService } from './services/auth.service'; // Assuming you have this service
import { UserService } from './services/user.service'; // Assuming you have this service
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 5, // Cache time-to-live in seconds (optional)
      max: 100, // Maximum number of items to store in the cache (optional)
    }),
    TypeOrmModule.forRoot(databaseConfig),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'volunteerbazaar', // Use environment variable for secret
      signOptions: { expiresIn: '30m' }, // Token expiration
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    EventModule,
  ],
  controllers: [HealthController, AuthController, AdminEventController,UserController],
  providers: [AuthService, UserService], // Make sure to provide AuthService and UserService
})
export class AppModule {}