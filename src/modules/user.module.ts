import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { EventService } from 'src/services/event.service';
import { UserService } from 'src/services/user.service';
import { EventModule } from './event.module';

// src/modules/user.module.ts
// src/modules/user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => EventModule)], // forwardRef if circular
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Make sure to export UserService if other modules need it
})
export class UserModule {}

